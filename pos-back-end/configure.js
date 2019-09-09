/**
 * Created by xsthunder on 2018/05/08
 * app configure.
 */
const fs = require('fs');
'use strict';

let enableMongoDb = false;

let enableDbLog = enableMongoDb||false;

let env = 'development';

let port = 27017   //20185;

let filedir = 'files';
filedir = `${__dirname}/${filedir}`;

const configure = {
	filedir:filedir,
	audio2waveform:
'python ../audio2waveform/audio2waveform.py',
//'/home/ubuntu/git/audio2waveform/venv/bin/python /home/ubuntu/git/audio2waveform/audio2waveform.py',
    audio2waveform2:
'python ../audio2waveform/audioanalysis/audioAnalysis.py',
	waveform_compare:
'E:/project/waveform-compare/install/waveform-compare',
//'/home/ubuntu/git/waveform-compare/release/waveform-compare',
	getsimilarrate:
'python ../audio2waveform/com.py',
	threshold:0.08,
	best_result:true
};


try{
	let {name,version} = JSON.parse( fs.readFileSync('package.json', 'utf-8') );
	configure.app = {
		name:name,
		env: env,
		version: version
	};
}catch(err){
	console.error('Failed to get app name and version', err);
}


configure.server = {
	port: port
};

configure.enableMongoDb = enableMongoDb;
if( enableMongoDb ){
	configure.mongoose = {
		url: 'mongodb://127.0.0.1:19970/test',
		port: 27017    //19970
	};
	configure.model = require('./app/schema/configure');
}

module.exports = configure;
