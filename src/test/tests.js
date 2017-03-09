//获取上传凭证
function getToken(Bucket, Object, expires, accessKey, secretKey){
	var p = {
		"Bucket" : Bucket,
		"Object" : Object,
		"Expires" : expires	
	}
	var putPolicy = JSON.stringify(p);
	var wordArray = CryptoJS.enc.Utf8.parse(putPolicy);
	var encodedPutPolicy = CryptoJS.enc.Base64.stringify(wordArray);
	var sign = CryptoJS.HmacSHA256(encodedPutPolicy, secretKey);
	var encodedSign = CryptoJS.enc.Base64.stringify(sign);
	return "UPLOAD " + accessKey + ":" + encodedSign + ":" + encodedPutPolicy;
}

var specialChar = "特殊   字符`-=[]\\;\',./ ~!@#$%^&*()_+{}|:\"<>?";
var that = new Uploader();

var param = {
		bucketName: 'bucketname',
		objectName: 'objectname',
		token: getToken('bucketname', 'objectname', 1489895484, 'accessKey', 'secretKey'),
		trunkSize: 4 * 1024 * 1024,        
	}

//添加文件
$('#fileInput').on('change', function(e) {
    if (e.target.files) { 
        that.addFile(e.target.files[0], function(curFile){
        	console.log(curFile.fileName + ' is added.');
        });
    }
});
//上传文件
$('#fileUploadBtn').on('click', function(){		
	that.upload(param, function(curFile){
		console.log('File: ' + curFile.fileName + ' is uploaded.');
	});
});
//中断上传
$('#pause').on('click', function(){
	that.pauseUpload();
});

var expect = chai.expect;

describe('nosup js sdk test', function() {
	//测试方法getCDN	
	describe('test getDNS function', function(){		
		var bucketName = param.bucketName;
	
		it('边缘节点列表的长度应大于等于0', function(done) {	
			var len;
			
		    that.getDNS(bucketName, function(ipList, lbs){
				len = ipList.length;
			});
			
	        setTimeout(function() {
	            expect(len).to.be.at.least(0);
	            done();
	        }, 1000);
		});
	});
	//方法测试getOffset	
	describe('test getOffset function', function(){
		var serveIp,
			bucketName,
			objectName,	
			token,
			fileKey;
		
		beforeEach(function() {
			bucketName = param.bucketName;
			objectName = param.objectName;
			token = param.token;
			
		    that.getDNS(bucketName, function(ipList, lbs){
				serveIp = ipList[0];
			});
			
			fileKey = that.uploadFile.fileKey;
		});
		
		it('当前分片偏移量应大于等于0', function(done){				
		
			var offset;			
		    that.getOffset({
		    	serveIp: serveIp,
				bucketName: bucketName,
				objectName: objectName,
				fileKey: fileKey,
				token: token,
		    }, function(off){
		    	offset = off;
		    });
		    
		    setTimeout(function() {
		    	expect(offset).to.be.at.least(0);
		    	done();
		    }, 1000);
		});
	});
	//测试方法uplodTrunk
	describe('test uploadTrunk function', function(){
		this.timeout(20000);
		var serveIp,
			bucketName,
			objectName,	
			token,
			curFile;
		
		beforeEach(function() {
			bucketName = param.bucketName;
			objectName = param.objectName;
			token = param.token;
			
		    that.getDNS(bucketName, function(ipList, lbs){
				serveIp = ipList[0];
			});
			
			curFile = that.uploadFile;
		});
		
		it('trunkEnd应大于等于文件的size', function(done){
			var trunkEnd, 
				size;
			
			that.getOffset({               
                serveIp: serveIp,
                bucketName: bucketName,
                objectName: objectName,
                fileKey: curFile.fileKey,
                token: token,
           }, function(offset) {
                that.uploadTrunk({
                    serveIp: serveIp,
                    bucketName: bucketName,
                    objectName: objectName,
                    token: token,
                }, {
                    file: curFile.file,
                    fileKey: curFile.fileKey,
                    offset: offset || 0,
                    trunkSize: param.trunkSize,
                    trunkEnd: (offset || 0) + param.trunkSize,
                    context: ''
                }, function(trunkData) {
                	trunkEnd = trunkData.trunkEnd;
                    size = trunkData.file.size;
                	that.clearStorage(trunkData.fileKey);
                	expect(trunkEnd).to.be.at.least(size);
                	done();
                });
            });		    
		});				
	});
	
	describe('test upload function', function(){
		this.timeout(20000);
		it('上传成功后回调函数中的文件和选择的文件相同', function(done){
			that.upload(param, function(curFile){
				expect(curFile.fileKey).to.equal(that.uploadFile.fileKey);
				done();
			});
		});			
	});

});


