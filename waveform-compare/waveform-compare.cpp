#include "opencv2/core/core.hpp"
#include "opencv2/features2d/features2d.hpp"
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/calib3d/calib3d.hpp"
#include "opencv2/nonfree/nonfree.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include <iostream>
#include <iomanip>
#ifdef DEBUG
#include<cstdio>
#endif
using namespace cv;
using namespace std;
#define P(A) cout << #A << ": " << (A) << endl;

int PinR(const Point2d &p, const Rect & r) {//判断点是否在某个矩形内，用于判断角点是否在停车位内
//	if (p.x < r.tl().x || p.y < r.tl().y)return false;
//	if (p.x > r.br().x || p.y > r.br().y)return false;
	if (p.x < r.tl().x || p.x > r.br().x)return -1;
	if (p.y < r.tl().y || p.y > r.br().y)return -2;
	return 0;
}
Rect ImgRect(const Mat &m) {
	return Rect(Point2d(0, 0), Point2d(m.cols, m.rows));
}


typedef int U;
//-----------------------------------【main( )函数】--------------------------------------------
//		描述：控制台应用程序的入口函数，我们的程序从这里开始执行
//-----------------------------------------------------------------------------------------------
int main(int argc,char **argv  )
{
	//TODO save file1 data(save to file)
	char *filename1 = "1.png";
	char *filename2 = "2.png";
	char title[205];
	if (argc == 3) {
		filename1 = argv[1];
		filename2 = argv[2];
	}
	//【1】载入原始图片

	Mat srcImage1 = imread( filename1, 0 );
	Mat srcImage2 = imread( filename2, 0 );
	if( !srcImage1.data || !srcImage2.data )
	{
		cout<<("can't read data"); return false;
	}

	//灰度处理，用0读入就是灰度图
//	cvtColor(srcImage1, srcImage1, CV_RGB2GRAY);
//	cvtColor(srcImage2, srcImage2, CV_RGB2GRAY);

	//截断二值化
	int maxval  =  255;
	int thres = 150;
	threshold(srcImage1, srcImage1, thres,maxval,THRESH_BINARY);
	threshold(srcImage2, srcImage2, thres,maxval,THRESH_BINARY);

	//【2】使用SURF算子检测关键点
	int minHessian = 400;//SURF算法中的hessian阈值
	SurfFeatureDetector detector( minHessian );//定义一个SurfFeatureDetector（SURF） 特征检测类对象
	vector<KeyPoint> keypoints_object, keypoints_scene;//vector模板类，存放任意类型的动态数组

	//【3】调用detect函数检测出SURF特征关键点，保存在vector容器中
	detector.detect( srcImage1, keypoints_object );
	detector.detect( srcImage2, keypoints_scene );

	//【4】计算描述符（特征向量）
	SurfDescriptorExtractor extractor;
	Mat descriptors_object, descriptors_scene;
	extractor.compute( srcImage1, keypoints_object, descriptors_object );
	extractor.compute( srcImage2, keypoints_scene, descriptors_scene );

	//【5】使用FLANN匹配算子进行匹配
	FlannBasedMatcher matcher;
	vector< DMatch > matches;
	matcher.match( descriptors_object, descriptors_scene, matches );
	double max_dist = 0; double min_dist = 100;//最小距离和最大距离

	//【6】计算出关键点之间距离的最大值和最小值
	for( int i = 0; i < descriptors_object.rows; i++ )
	{
		double dist = matches[i].distance;
		if( dist < min_dist ) min_dist = dist;
		if( dist > max_dist ) max_dist = dist;
	}

#ifdef DEBUG
	printf(">Max dist 最大距离 : %f \n", max_dist );
	printf(">Min dist 最小距离 : %f \n", min_dist );
#endif // DEBUG


	//【7】存下匹配距离小于3*min_dist的点对
	std::vector< DMatch > good_matches;
	for( int i = 0; i < descriptors_object.rows; i++ )
	{
		if( matches[i].distance <= 3*min_dist )
		{
			good_matches.push_back( matches[i]);
		}
	}

	//绘制出匹配到的关键点
	Mat img_matches;
	drawMatches( srcImage1, keypoints_object, srcImage2, keypoints_scene,
		good_matches, img_matches, Scalar::all(-1), Scalar::all(-1),
		vector<char>(), DrawMatchesFlags::NOT_DRAW_SINGLE_POINTS );

	//定义两个局部变量
	vector<Point2f> obj;
	vector<Point2f> scene;

	//从匹配成功的匹配对中获取关键点
	for( unsigned int i = 0; i < good_matches.size(); i++ )
	{
		obj.push_back( keypoints_object[ good_matches[i].queryIdx ].pt );
		scene.push_back( keypoints_scene[ good_matches[i].trainIdx ].pt );
	}

	Mat H = findHomography( obj, scene, CV_RANSAC );//计算透视变换

	//从待测图片中获取角点
	vector<Point2f> obj_corners(4);
	obj_corners[0] = cvPoint(0,0); obj_corners[1] = cvPoint( srcImage1.cols, 0 );
	obj_corners[2] = cvPoint( srcImage1.cols, srcImage1.rows ); obj_corners[3] = cvPoint( 0, srcImage1.rows );
	vector<Point2f> scene_corners(4);

	//进行透视变换
	perspectiveTransform( obj_corners, scene_corners, H);

	//绘制出角点之间的直线
	line( img_matches, scene_corners[0] + Point2f( static_cast<float>(srcImage1.cols), 0), scene_corners[1] + Point2f( static_cast<float>(srcImage1.cols), 0), Scalar(255, 0, 123), 4 );
	line( img_matches, scene_corners[1] + Point2f( static_cast<float>(srcImage1.cols), 0), scene_corners[2] + Point2f( static_cast<float>(srcImage1.cols), 0), Scalar( 255, 0, 123), 4 );
	line( img_matches, scene_corners[2] + Point2f( static_cast<float>(srcImage1.cols), 0), scene_corners[3] + Point2f( static_cast<float>(srcImage1.cols), 0), Scalar( 255, 0, 123), 4 );
	line( img_matches, scene_corners[3] + Point2f( static_cast<float>(srcImage1.cols), 0), scene_corners[0] + Point2f( static_cast<float>(srcImage1.cols), 0), Scalar( 255, 0, 123), 4 );

	//判断scene四个点和srcImage2的代表矩阵的关系
	Rect src2_rect = ImgRect(srcImage2);
	double src2_rect_area = src2_rect.area();
	double scene_conrners_area = contourArea(scene_corners);

#ifdef DEBUG
	sprintf(title, " %s %s\n", filename1, filename2);
	cout << "srcImage2 Rect "<<src2_rect.tl() << ' ' << src2_rect.br() << endl;
	int sum = 0,tmp;
	for (auto x: scene_corners) {
		cout << x << " in scene :"<<(tmp = PinR(x,src2_rect))<<endl;
		sum += tmp;
	}
	cout << "waveform ";
	if (sum == 0)cout << "match!"<<endl;
	else cout << "dismatch" << endl;

	cout << "area" << endl;
	//判断面积关系
	P(scene_conrners_area);
	P(src2_rect_area);
	//显示最终结果
	imshow( title, img_matches );
	waitKey(0);
#endif // DEBUG

	cout << fixed<<setprecision(6)<<(scene_conrners_area / src2_rect_area) << endl;
	return 0;
}


