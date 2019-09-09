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

int PinR(const Point2d &p, const Rect & r) {//�жϵ��Ƿ���ĳ�������ڣ������жϽǵ��Ƿ���ͣ��λ��
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
//-----------------------------------��main( )������--------------------------------------------
//		����������̨Ӧ�ó������ں��������ǵĳ�������￪ʼִ��
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
	//��1������ԭʼͼƬ

	Mat srcImage1 = imread( filename1, 0 );
	Mat srcImage2 = imread( filename2, 0 );
	if( !srcImage1.data || !srcImage2.data )
	{
		cout<<("can't read data"); return false;
	}

	//�Ҷȴ�����0������ǻҶ�ͼ
//	cvtColor(srcImage1, srcImage1, CV_RGB2GRAY);
//	cvtColor(srcImage2, srcImage2, CV_RGB2GRAY);

	//�ض϶�ֵ��
	int maxval  =  255;
	int thres = 150;
	threshold(srcImage1, srcImage1, thres,maxval,THRESH_BINARY);
	threshold(srcImage2, srcImage2, thres,maxval,THRESH_BINARY);

	//��2��ʹ��SURF���Ӽ��ؼ���
	int minHessian = 400;//SURF�㷨�е�hessian��ֵ
	SurfFeatureDetector detector( minHessian );//����һ��SurfFeatureDetector��SURF�� ������������
	vector<KeyPoint> keypoints_object, keypoints_scene;//vectorģ���࣬����������͵Ķ�̬����

	//��3������detect��������SURF�����ؼ��㣬������vector������
	detector.detect( srcImage1, keypoints_object );
	detector.detect( srcImage2, keypoints_scene );

	//��4������������������������
	SurfDescriptorExtractor extractor;
	Mat descriptors_object, descriptors_scene;
	extractor.compute( srcImage1, keypoints_object, descriptors_object );
	extractor.compute( srcImage2, keypoints_scene, descriptors_scene );

	//��5��ʹ��FLANNƥ�����ӽ���ƥ��
	FlannBasedMatcher matcher;
	vector< DMatch > matches;
	matcher.match( descriptors_object, descriptors_scene, matches );
	double max_dist = 0; double min_dist = 100;//��С�����������

	//��6��������ؼ���֮���������ֵ����Сֵ
	for( int i = 0; i < descriptors_object.rows; i++ )
	{
		double dist = matches[i].distance;
		if( dist < min_dist ) min_dist = dist;
		if( dist > max_dist ) max_dist = dist;
	}

#ifdef DEBUG
	printf(">Max dist ������ : %f \n", max_dist );
	printf(">Min dist ��С���� : %f \n", min_dist );
#endif // DEBUG


	//��7������ƥ�����С��3*min_dist�ĵ��
	std::vector< DMatch > good_matches;
	for( int i = 0; i < descriptors_object.rows; i++ )
	{
		if( matches[i].distance <= 3*min_dist )
		{
			good_matches.push_back( matches[i]);
		}
	}

	//���Ƴ�ƥ�䵽�Ĺؼ���
	Mat img_matches;
	drawMatches( srcImage1, keypoints_object, srcImage2, keypoints_scene,
		good_matches, img_matches, Scalar::all(-1), Scalar::all(-1),
		vector<char>(), DrawMatchesFlags::NOT_DRAW_SINGLE_POINTS );

	//���������ֲ�����
	vector<Point2f> obj;
	vector<Point2f> scene;

	//��ƥ��ɹ���ƥ����л�ȡ�ؼ���
	for( unsigned int i = 0; i < good_matches.size(); i++ )
	{
		obj.push_back( keypoints_object[ good_matches[i].queryIdx ].pt );
		scene.push_back( keypoints_scene[ good_matches[i].trainIdx ].pt );
	}

	Mat H = findHomography( obj, scene, CV_RANSAC );//����͸�ӱ任

	//�Ӵ���ͼƬ�л�ȡ�ǵ�
	vector<Point2f> obj_corners(4);
	obj_corners[0] = cvPoint(0,0); obj_corners[1] = cvPoint( srcImage1.cols, 0 );
	obj_corners[2] = cvPoint( srcImage1.cols, srcImage1.rows ); obj_corners[3] = cvPoint( 0, srcImage1.rows );
	vector<Point2f> scene_corners(4);

	//����͸�ӱ任
	perspectiveTransform( obj_corners, scene_corners, H);

	//���Ƴ��ǵ�֮���ֱ��
	line( img_matches, scene_corners[0] + Point2f( static_cast<float>(srcImage1.cols), 0), scene_corners[1] + Point2f( static_cast<float>(srcImage1.cols), 0), Scalar(255, 0, 123), 4 );
	line( img_matches, scene_corners[1] + Point2f( static_cast<float>(srcImage1.cols), 0), scene_corners[2] + Point2f( static_cast<float>(srcImage1.cols), 0), Scalar( 255, 0, 123), 4 );
	line( img_matches, scene_corners[2] + Point2f( static_cast<float>(srcImage1.cols), 0), scene_corners[3] + Point2f( static_cast<float>(srcImage1.cols), 0), Scalar( 255, 0, 123), 4 );
	line( img_matches, scene_corners[3] + Point2f( static_cast<float>(srcImage1.cols), 0), scene_corners[0] + Point2f( static_cast<float>(srcImage1.cols), 0), Scalar( 255, 0, 123), 4 );

	//�ж�scene�ĸ����srcImage2�Ĵ������Ĺ�ϵ
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
	//�ж������ϵ
	P(scene_conrners_area);
	P(src2_rect_area);
	//��ʾ���ս��
	imshow( title, img_matches );
	waitKey(0);
#endif // DEBUG

	cout << fixed<<setprecision(6)<<(scene_conrners_area / src2_rect_area) << endl;
	return 0;
}


