# NOS JS SDK

## 文档简介

NOS JS SDK是用于浏览器端上传文件到nos的软件开发工具包，提供简单、便捷的方法，方便用户实现文件上传功能。在使用Android Sdk前必须要开通NOS服务，并需要拥有一个有效的Access Key(包括Access Key和Access Secret)用来生成上传凭证。可以通过如下步骤获得：
 
1. 登录 https://c.163.com/ 注册用户。
2. 注册后，蜂巢会颁发 Access Key 和 Secret Key 给客户，您可以在蜂巢“用户中心”的“Access Key”查看并管理您的Access Key。

## 支持功能

JS SDK主要实现了以下几种功能：

1. 客户端直传：客户端可以将数据直接上传到NOS，不用经过业务方上传服务器
2. 断点续传：上传中断后，可以断点续传，节省用户流量
3. 全国加速节点：遍布全国加速节点，自动选择最优的加速节点
4. 中断上传：用户可以取消或暂停上传

## 使用方法

### 引入依赖

下载最新的SDK源码文件，NOS JS SDK依赖jquery和crypto-js加密库，因此需提前引入js文件

```
<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.js"></script>
<script type="text/javascript" src="js/crypto-js.js"></script>
<script type="text/javascript" src="js/nos-js-sdk.js"></script>
```

### 初始化上传对象

#### 配置参数

新建一个对象，配置所需参数：

	
```
var opt = {
        fileInputID: <string>
        onError: <function>,
        onProgress: <function>,
    }
```

***注意***

若无需求，可不配置该参数。

#### 配置项说明


***fileInputID***

**说明** 

关联文件选择输入框ID， 默认为fileInput，若另指定，则必须配置该参数。

***onError***

**说明**

错误处理函数

**参数**

名称 | 类型 | 是否必需 | 描述 |
---|---|---|---
errObj | Object | 否 | 带errCode和errMsg或只带errMsg的Object对象或XHR错误对象

**返回值**
 
无

***onProgress***

**说明**

上传进度回调处理函数

**参数**

名称 | 类型 | 是否必需 | 描述 |
---|---|---|---
curFile | Object | 否 | 当前正在上传的文件对象
	  
**返回值**

无

#### 初始化

将配置参数传入Uploader，通过以下调用进行事件的绑定和相关初始化操作
	

```
<script type="text/javascript">
	var uploader = Uploader(opt);
</script>
```

	
### 文件上传

#### 添加文件

选择上传的文件时，需要调用SDK中的addFile方法添加文件，该方法为选择的文件封装一个新的文件对象。


```
var fileInput = document.getElementById('fileInput');
fileInput.on('change', function(e) {
    if (e.target.files) { 
        uploader.addFile(e.target.files[0]);
    }
});
```

***注意***

1. 一次只能添加一个文件。

2. addFile封装的文件对象说明：


名称 | 类型 | 描述 |
---|---|---
fileKey | String | 文件名与文件大小的MD5值
file | File | 文件对象
fileName | String | 文件名 |
status | Number | 文件状态（ 0 未上传  1 正在上传  2 已上传） |
progress | Number | 上传进度（保留两位小数的百分比）|
      
#### 调用上传接口

新建一个对象，配置上传文件所需参数：

```
var param = {
	bucketName: <string>,
	objectName: <string>,
	token: <string>,
	trunkSize: <long>,		
}
```
	
**参数**

名称 | 类型 | 是否必需 | 描述 |
---|---|---|---
bucketName | String | 是 | 上传文件所需桶名
objectName | String | 是 | 为上传的文件指定的对象名
token | String | 是 | 上传凭证
trunkSize | long | 否 | 分片大小， 默认128 * 1024

通过Uploader的实例对象调用上传接口upload方法完成上传。

```
<script type="text/javascript">
	uploader.upload(param);
</script>
```

### 中断上传
	
通过Uploader的实例对象调用pauseUpload方法中断上传。

```
<script type="text/javascript">
	uploader.pauseUpload();
</script>
```
	
### 断点续传

当文件上传中断后，用户只需重新选择文件提交即可恢复上传, 但要注意的是objectname，bucketname要与之前相同。

## 上传文件简单示例


```
<!DOCTYPE html>
<html>
<head>
	<title>NOS SDK for JavaScript - Sample Application</title>
	<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.js"></script>
	<script type="text/javascript" src="js/crypto-js.js"></script>
	<script type="text/javascript" src="js/nos-js-sdk.js"></script>
</head>

<body>

<input type="file" id="fileInput" />
<button id="fileUploadBtn">上传</button>

<script type="text/javascript">
	var uploader = Uploader();		
	
	 $('#fileInput').on('change', function(e) {
		if (e.target.files) { 
			uploader.addFile(e.target.files[0]);
		}
	});
	
	$('#fileUploadBtn').on('click', function(){
		var param = {
			bucketName: 'your bucket name',
			objectName: 'you object name',
			token: 'upload token',
			trunkSize: 'size of trunk',        
		}
		
		uploader.upload(param);
	});	
</script>

</body>
</html>
```

***注意***

有关JS-SDK详细接口实现请看SDK代码注释。