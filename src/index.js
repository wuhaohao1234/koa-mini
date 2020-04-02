var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : '123456789',       
  port: '3306',                   
  database: 'school' 
}); 
 
connection.connect();
 
// var  sql = 'SELECT * FROM class_table';
// //查
// connection.query(sql,function (err, result) {
//         if(err){
//           console.log('[SELECT ERROR] - ',err.message);
//           return;
//         }
 
//        console.log('--------------------------SELECT----------------------------');
//        console.log(result);
//        console.log('------------------------------------------------------------\n\n');  
// });
// 增

var userAddSql = 'INSERT INTO class_table VALUES(?,?)';
var userAddSql_Params = ['华为', 722];
//增
connection.query(userAddSql, userAddSql_Params, function (err, result) {
    if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
    }

    console.log('--------------------------INSERT----------------------------');
    //console.log('INSERT ID:',result.insertId);
    console.log('INSERT ID:', result);
    console.log('-----------------------------------------------------------------\n\n');
});

 
connection.end();