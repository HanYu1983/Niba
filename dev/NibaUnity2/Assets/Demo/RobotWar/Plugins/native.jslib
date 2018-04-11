mergeInto(LibraryManager.library, {
  PersistentDataPath: function () {
	console.log("PersistentDataPath");
	var returnStr = "save";
	var bufferSize = lengthBytesUTF8(returnStr) + 1
    var buffer = _malloc(bufferSize)
    stringToUTF8(returnStr, buffer, bufferSize)
	return buffer;
  },
  
  IsFileExist: function(_path){
	console.log("IsFileExist");
	var path = Pointer_stringify(_path)
	return localStorage[path] != undefined
  },
  
  ReadAllText: function(_path){
	var path = Pointer_stringify(_path)
	var returnStr = localStorage[path]
	console.log("ReadAllText");
	console.log(returnStr);
	
	var bufferSize = lengthBytesUTF8(returnStr) + 1
    var buffer = _malloc(bufferSize)
    stringToUTF8(returnStr, buffer, bufferSize)
	return buffer
  },
  
  DeleteFile: function(_path){
	console.log("DeleteFile");
	var path = Pointer_stringify(_path)  
	localStorage.removeItem(path)
  },
  
  WriteAllText: function(_path, _data){
	  console.log("WriteAllText");
	  var path = Pointer_stringify(_path)
	  var data = Pointer_stringify(_data)
	  console.log(path);
	  console.log(JSON.parse(data))
	  localStorage.setItem(path, data)
  }
});