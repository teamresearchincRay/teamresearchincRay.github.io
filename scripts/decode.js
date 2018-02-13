var partNumber;
var itemQTY;
var density;
var width;
var height;
var depth;
var ICQTY;
var rank;
var totalCapacity="N/A";
var type;
var mode;
var voltage="N/A";
var speed;
var ICConfig;
var moduleType="N/A";
var ECC;
var package;
var modeGrp;
var tech;
var block_size;
var base_density;
var stack;
var VCC_ORG;
var AVAIL;
var REMARK;
var SIZE;
function decode(){
	for (var i=0;i<typeGroup.length;i++) {
   
      if (typeGroup[i].checked) {
         
      if(typeGroup[i].value == "Flash"){
      	decode_Flash();

      }else{
      	decode_RAM();
      }
   }
   }
}

function decode_Flash(){
	var data=[];
	document.getElementById("mainTable").style.visibility = "hidden";
	document.getElementById("subTable").style.visibility = "hidden";
	document.getElementById("flashTable").style.visibility = "visible";
	$( "#myTableBody" ).empty();
	$( "#mySubTableBody" ).empty();
	$( "#myFlashTableBody" ).empty();
	var exist;
	var line;
	var lines = $('#partNumListarea').val().replace(/\n/g,"###").replace(/\s/g,"@@").split('###');
	//console.log(lines);
	for (var i = 0; i< lines.length; i++){
		line = lines[i].split("-");
		partNumber = line[0];
		var x ="";
		var exist = true;
		for (var j in hynix_data){
   			if(partNumber == hynix_data[j].PRODUCT){
   				exist = true;
   				console.log( hynix_data[j].TYPE);
   				type = hynix_data[j].TYPE;
   				tech = hynix_data[j].TECH;
   				density = hynix_data[j].DENSITY;
   				block_size = hynix_data[j].BLOCK_SIZE;
   				base_density = hynix_data[j].BASE_DENSITY;
   				stack = hynix_data[j].STACK;
   				VCC_ORG = hynix_data[j].VCC_ORG;
   				package = hynix_data[j].PKG;
   				AVAIL = hynix_data[j].AVAIL;
   				SIZE = hynix_data[j].SIZE;
   				REMARK= hynix_data[j].REMARK;
   				$("#myFlashTableBody").append('<tr><td>'+partNumber+'</td><td>'
				+type+'</td><td>'
				+tech+'</td><td>'
				+density+' G</td><td>'//Density
				+block_size+'</td><td>'//QTY
				+base_density+'</td><td>'
				+stack+'</td><td>'
				+VCC_ORG+'</td><td>'
				+package+'</td><td>'
				+SIZE+'</td><td>'
				+REMARK+'</td><td>'
				+AVAIL+'</td></tr>');
			

   				break;
   			}else{
   				exist = false;
   			}

		}
		//console.log(hynix_data[1].PRODUCT);
		if (exist == false){
		   		partNumber = partNumber + " CANNOT FIND!";
		   		type = "No data";
   				tech = "No data";
   				density = "No data";
   				block_size = "No data";
   				base_density = "No data";
   				stack = "No data";
   				VCC_ORG = "No data";
   				package = "No data";
   				AVAIL = "No data";
   				SIZE = "No data";
   				REMARK= "No data";
   				$("#myFlashTableBody").append('<tr><td>'+partNumber+'</td><td>'
				+type+'</td><td>'
				+tech+'</td><td>'
				+density+'</td><td>'//Density
				+block_size+'</td><td>'//QTY
				+base_density+'</td><td>'
				+stack+'</td><td>'
				+VCC_ORG+'</td><td>'
				+package+'</td><td>'
				+SIZE+'</td><td>'
				+REMARK+'</td><td>'
				+AVAIL+'</td></tr>');
				console.log( partNumber);
			}

	}
}

function decode_RAM (){
	var data=[];
	document.getElementById("mainTable").style.visibility = "visible";
	document.getElementById("subTable").style.visibility = "visible";
	$( "#myTableBody" ).empty();
	$( "#mySubTableBody" ).empty();
	var exist;
	var line;
	var lines = $('#partNumListarea').val().replace(/\n/g,"###").replace(/\s/g,"@@").split('###');
	console.log(lines);
	for (var i = 0; i<lines.length; i++){
		line = lines[i].split('@@');
		console.log(line[0]);
		
		/*density = line[2];
		console.log("density" + line[2].slice(-1));
		if (line[2].slice(-1) == "M" ||line[2].slice(-1) == "MB" ){
			density = (density.slice(0,-1))/1024;
			console.log("density" + density);
		}else{
			density = (density.slice(0,-1));
		}*/

		partNumber = line[0];
		itemQTY = line[1];
		//console.log(partNumber[1]);
		//==================Check Total QTY=====================================
		exist = false;
		for(var a = 0; a<data.length;a++ ){
		
			if(data[a].PM.toString() == line[0].toString()){
				data[a].QTY += parseInt(line[1]);
				exist = true;
			}
			
		}
		if (exist != true){
			data.push({"PM":line[0],"QTY":parseInt(line[1])});
		}
		//==================Check Total QTY=====================================
		//check type
		switch (partNumber[1]){
			case "M":
				type="Module";
			break;
			case "5":
				type="IC";
			break;
			case "9":
				type="LPDDR4";
			break;
			default:
				type="Unkown";

		}
		console.log("type is " + type);
		

		//==================================================Module============================
		if(type == "Module"){
			get_density_module(partNumber[3]);
			if(partNumber[2] == "T"){//DDR3
				voltage="N/A";
				modeGrp="DDR3";
				get_speedDDR3(partNumber[14],partNumber[15]);
			}else if (partNumber[2] == "A"){//DDR4
				voltage="1.2V";
				modeGrp="DDR4";
				get_speedDDR4(partNumber[14],partNumber[15]);
			}else if(partNumber[2] == "P"){
				voltage ="N/A";
				modeGrp="DDR2";
				get_speedDDR2(partNumber[14],partNumber[15]);
			}
			get_depth(partNumber[4],partNumber[5]);

			get_width(partNumber[11]);
			get_module_type(partNumber[6]);
			checkECC(partNumber[7]);
			check_package(partNumber[9]);
			if(ECC == "ECC"){
				moduleType = "ECC "+moduleType;
			}

			height = density / width;

			console.log("height " + height);
			if(height >=1 ){
			ICConfig = height + "G*"+width;
			}else{
			ICConfig = height*1024 + "M*"+width;
			}
			rank = depth/height;
			console.log("rank " + rank);
			if(ECC == "ECC"){
				ICQTY = (64/width*rank)/package+ ((rank*8)/width);
			}else{
				ICQTY = (64/width*rank)/package;
			}
			console.log("ICQTY" + ICQTY);
			if(ECC =="ECC"){
				totalCapacity = (ICQTY-((rank*8)/width))*density/8;
			}else{
				totalCapacity = ICQTY*density/8;
			}
			if (package == 2 ){

				ICQTY = ICQTY + " DDP";
			}else if (package == 4){
				ICQTY = ICQTY + " QDP";
			}
			$("#myTableBody").append('<tr><td>'+(i+1)+'</td><td>'
			+modeGrp+'</td><td>'
			+line[0]+'</td><td>'
			+density+' G</td><td>'//Density
			+line[1]+'</td><td>'//QTY
			+type+'</td><td>'
			+speed+'</td><td>'
			+ICConfig+'</td><td>'
			+rank+'</td><td>'
			+ICQTY+'</td><td>'
			+totalCapacity+"G"+'</td><td>'
			+moduleType+'</td><td>'
			+voltage+'</td></tr>');


		} else if (type == "IC"){//======================IC==================
			//get Density.
			get_density_IC(partNumber[4],partNumber[5]);
			//check voltage
			get_voltage(partNumber[3]);
			//check depth
			//get_depth(partNumber[4],partNumber[5]);

			//check width
			get_width(partNumber[6]);
			//check speed 
			if(partNumber[2] == "T"){
				get_speedDDR3(partNumber[12],partNumber[13]);
				modeGrp="DDR3";
			}else if (partNumber[2]=="A"){
				modeGrp="DDR4";
				get_speedDDR4(partNumber[12],partNumber[13]);
			}else if(partNumber[2]== "P"){
				modeGrp="DDR2";
				get_speedDDR2(partNumber[12],partNumber[13]);
			}


			//get_module_type(partNumber[6]);

			height = density / width;
			console.log("height " + height);
			if(height >=1 ){
				ICConfig = height + "G*"+width;
			}else{
				ICConfig = height*1024 + "M*"+width;
			}
			
			$("#myTableBody").append('<tr><td>'+(i+1)+'</td><td>'
			+modeGrp+'</td><td>'
			+line[0]+'</td><td>'//part number
			+density+' G</td><td>'//density
			+line[1]+'</td><td>'//QTY
			+type+'</td><td>'
			+speed+'</td><td>'
			+ICConfig+'</td><td>'
			+"N/A"+'</td><td>'
			+"N/A"+'</td><td>'
			+"N/A"+'</td><td>'
			+"N/A"+'</td><td>'
			+voltage+'</td></tr>');


		}//ICcc
		else if(type =="LPDDR4"){

			get_density_IC(partNumber[7],partNumber[8]);
			$("#myTableBody").append('<tr><td>'+(i+1)+'</td><td>'
			+modeGrp+'</td><td>'
			+line[0]+'</td><td>'//part number
			+density+' G</td><td>'//density
			+line[1]+'</td><td>'//QTY
			+type+'</td><td>'
			+speed+'</td><td>'
			+ICConfig+'</td><td>'
			+"N/A"+'</td><td>'
			+"N/A"+'</td><td>'
			+"N/A"+'</td><td>'
			+"N/A"+'</td><td>'
			+voltage+'</td></tr>');
		}
	
		
	}//for (var i = 0; i<lines.length; i++)
	for(var i = 0; i<data.length;i++){
		$("#mySubTableBody").append('<tr><td>'+data[i].PM+'</td><td>'
			+data[i].QTY+'</td>');
		console.log("data" + data[i].PM+" "+ data[i].QTY );
	}
	
}
function get_density_module(d1){
	if (d1 == "2"){

		density = 0.25;

	}else if (d1 == "5" ){

		density = 0.5;

	}else if (d1 == "1" ){
		density = 1;
		
	}else if (d1 == "3"){
		density = 2;
	}else if (d1 == "4"){
		density = 4;
	}else if (d1 == "8" ){
		density = 8;
	}else if (d1 == "A"){
		density = 16;
	}else if (d1 == "B"){
		density = 32;
	}
			
}
function get_density_IC(d1, d2){
	if (d1 == "2" && d2=="5"){

		density = 0.25;

	}else if (d1 == "5" && d2=="1"){

		density = 0.5;

	}else if (d1 == "1" && d2=="G"){
		density = 1;
		
	}else if (d1 == "2" && d2=="G"){
		density = 2;
	}else if (d1 == "4" && d2=="G"){
		density = 4;
	}else if (d1 == "8" && d2=="G"){
		density = 8;
	}else if (d1 == "A" && d2=="G"){
		density = 16;
	}else if (d1 == "B" && d2=="G"){
		density = 32;
	}else if (d1 == "A" && d2=="H"){
		density = 12;	
	}else if (d1 == "B" && d2=="P"){
		density = 16;
	}else if (d1 == "B" && d2=="K"){
		density = 16;
	}else if (d1 == "C" && d2=="P"){
		density = 32;
	}else if (d1 == "D" && d2=="A"){
		density = 24;
	}
			
}

function get_voltage(v){


	switch (v){
				case "N":
					voltage="1.2V";
				break;
				case "Q":
					voltage="1.5V";
				break;
				case "C":
					voltage="1.35V";
				break;
				case "K":
					voltage="1.25V";
				break;
				case "S":
					voltage="1.8V"; 
				break;
				case "G":
					voltage="1.55V";
				break;
			}
			console.log("voltage is " + voltage);
}

function get_depth(d1,d2){
	if(d1 =="2" && d2=="5"){
		depth = 0.25;
	}else if (d1 =="5" && d2=="1"){
				depth = 0.5;
	}else if (d1=="1" && d2=="G"){
				depth = 1;
	}else if (d1=="2" && d2=="G"){
				depth = 2;
	}else if (d1=="4" && d2=="G"){
				depth = 4;
	}else if (d1=="8" && d2=="G"){
				depth = 8;
	}else if (d1=="A" && d2=="G"){
				depth = 16;
	}else if (d1=="B" && d2=="G"){
				depth = 32;
	}else{
				depth = "Unkown";
	}
			console.log("depth is "+ depth);
}

function get_width(w){

	if(w == 6){
			width = 16;
	}else if(w == 2){

			width = 32;
	}else{
			width = w;
	}
		console.log("width is " + width);	
}
function get_speedDDR2(s1,s2){

			if (s1 =="G" && s2=="7"){
				speed = 1066;
			}else if (s1 =="G" && s2=="6"){
				speed = 1066;
			}else if (s1 =="S" && s2=="6"){
				speed = 800;
			}else if (s1 =="S" && s2=="5"){
				speed = 800;
			}else if (s1 =="Y" && s2=="5"){
				speed = 667;
			}else if (s1 =="Y" && s2=="4"){
				speed = 667;
			}else if (s1 =="C" && s2=="4"){
				speed = 533;
			}else if (s1 =="E" && s2=="3"){
				speed = 400;
			}else{
				speed = "UnkownDDR3";
			}

			
			console.log("speed is " +s1 + s1 + speed);
}
function get_speedDDR3(s1,s2){

			if (s1 =="T" && s2=="E"){
				speed = 2133;
			}else if (s1 =="R" && s2=="D"){
				speed = 1866;
			}else if (s1 =="P" && s2=="B"){
				speed = 1600;
			}else if (s1 =="H" && s2=="9"){
				speed = 1333;
			}else if (s1 =="G" && s2=="7"){
				speed = 1066;
			}else if (s1 =="S" && s2=="6"){
				speed = 800;
			}else{
				speed = "UnkownDDR3";
			}

			
			console.log("speed is " +s1 + s1 + speed);
}
function get_speedDDR4(s1,s2){
	//check speed DDR4
			if (s1 =="T" && s2=="F"){
				speed = 2133;
			}else if (s1 =="U" && s2=="H"){
				speed = 2400;
			}else if (s1 =="U" && s2=="L"){
				speed = 2400;
			}else if (s1 =="V" && s2=="K"){
				speed = 2666;
			}else if (s1 =="V" && s2=="N"){
				speed = 2666;
			}else if (s1 =="W" && s2=="M"){
				speed = 2933;
			}else if (s1 =="X" && s2=="N"){
				speed = 3200;
			}else{
				speed = "UnkownDDR4";
			}
}

function get_module_type(m){
	switch(m){
		case "U":
			moduleType="Unbuffered DIMM";
		break;
		case "R":
			moduleType="Registered DIMM";
		break;
		case "V":
			moduleType="VLP Registered DIMM";
		break;
		case "S":
			moduleType="Unbuffered SO-DIMM";
		break;
		case "L":
			moduleType="LRDIMM";
		break;
		case "A":
			moduleType="ECC SO-DIMM";
		break;
		case "B":
			moduleType="SO-DIMM (Single Side)";
		break;
		case "E":
			moduleType="VLP ECC UDIMM";
		break;
		case "M":
			moduleType="ULP Mini UDIMM";
		break;
		default:
			moduleType ="Unkown";
	}

}
function checkECC(e){
		if(e == 6 || e== 1 || e ==2){
			ECC = "Non-ECC";
		}else if (e == 7 || e== 8 || e ==9 ){
			ECC ="ECC";
		}else {
			ECC = "Unkown"
		}
}
function check_package(p){
	if(p == "F" || p == "J"){
		package = 1;
	}else if (p == "M" ||p == "P" ||p=="L"){
		package =2;
	}else if (p == "H" ){
		package =4;
	}else {
		package ="Unkown";
	}

}

function displayQTY(){


	

}
var hynix_data=[
 {
   "PRODUCT": "H27U1G8F2B",
   "TECH": "4xnm",
   "DENSITY": "1Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "TSOP/FBGA",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27S1G8F2B",
   "TECH": "4xnm",
   "DENSITY": "1Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "1.8V / x8",
   "PKG": "TSOP/FBGA",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27U1G8F2C",
   "TECH": "3xnm",
   "DENSITY": "1Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "TSOP/FBGA",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27S1G8F2C",
   "TECH": "3xnm",
   "DENSITY": "1Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "1.8V / x8",
   "PKG": "TSOP/FBGA",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27U2G8F2C",
   "TECH": "4ynm",
   "DENSITY": "2Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "TSOP",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27S2G8F2C",
   "TECH": "4ynm",
   "DENSITY": "2Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "1.8V / x8",
   "PKG": "TSOP/FBGA",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27U2G8F2D",
   "TECH": "3xnm",
   "DENSITY": "2Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "TSOP",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27S2G8F2D",
   "TECH": "3xnm",
   "DENSITY": "2Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "1.8V / x8",
   "PKG": "TSOP",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27U4G8F2D",
   "TECH": "4ynm",
   "DENSITY": "4Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "TSOP",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27U4G8F2E",
   "TECH": "3xnm",
   "DENSITY": "4Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "TSOP",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27S4G8F2E",
   "TECH": "3xnm",
   "DENSITY": "4Gb",
   "BLOCK_SIZE": "128KB",
   "STACK": "SDP",
   "VCC_ORG": "1.8V / x8",
   "PKG": "TSOP",
   "AVAIL": "Now",
   "REMARK": "-",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27U4G(O/8)F2G",
   "TECH": "1xnm",
   "DENSITY": "4Gb",
   "BLOCK_SIZE": "256KB/128KB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "TSOP",
   "AVAIL": "Q1’18",
   "REMARK": "O:4KB/8:2KB",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27U8G(O/8)G5G",
   "TECH": "1xnm",
   "DENSITY": "4Gb",
   "BLOCK_SIZE": "256KB/128KB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "TSOP",
   "AVAIL": "Q1’18",
   "REMARK": "O:4KB/8:2KB",
   "TYPE": "SLC"
 },
 {
   "PRODUCT": "H27QCG8T2E",
   "TECH": "1xnm",
   "DENSITY": "64Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QDG8UDE",
   "TECH": "1xnm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QEG8VEE",
   "TECH": "1xnm",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QFG8YEE",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QCG8T2F",
   "TECH": "1xnm",
   "DENSITY": "64Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QDG8UDF",
   "TECH": "1xnm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QEG8VEF",
   "TECH": "1xnm",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QFG8YEF",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QDG8T2B",
   "TECH": "1xnm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QEG8UDB",
   "TECH": "1xnm",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QFG8VEB",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27Q1T8YEB",
   "TECH": "1xnm",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QFG8VQB",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27Q1T8YQB",
   "TECH": "1xnm",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27Q2T8CQB",
   "TECH": "1xnm",
   "DENSITY": "2048Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "16DP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QFG84EB",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27Q1T85EB",
   "TECH": "1xnm",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27Q2T87EB",
   "TECH": "1xnm",
   "DENSITY": "2048Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "16DP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QFG8PEM",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC/TLC"
 },
 {
   "PRODUCT": "H27Q1T8QEM",
   "TECH": "1xnm",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC/TLC"
 },
 {
   "PRODUCT": "H27QCG882M",
   "TECH": "1xnm",
   "DENSITY": "64Gb",
   "BLOCK_SIZE": "6MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC/TLC"
 },
 {
   "PRODUCT": "H27QDG89DM",
   "TECH": "1xnm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "6MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27TDG8T2D",
   "TECH": "1ynm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "6MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27TEG8U5D",
   "TECH": "1ynm",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "6MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27TFG8VFD",
   "TECH": "1ynm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "6MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QDG8T2C",
   "TECH": "3D-V2",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "9MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QEG8UDC",
   "TECH": "3D-V2",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "9MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QFG8VEC",
   "TECH": "3D-V2",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "9MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27Q1T8YEC",
   "TECH": "3D-V2",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "9MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27Q2T8CEC",
   "TECH": "3D-V2",
   "DENSITY": "2048Gb",
   "BLOCK_SIZE": "9MB",
   "STACK": "16DP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H25QEM8A1B",
   "TECH": "3D-V4",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "19MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Q4'18",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC"
 },
 {
   "PRODUCT": "H27QDG8M2M",
   "TECH": "1xnm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27QEG8NDM",
   "TECH": "1xnm",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27QFG8PEM",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC/TLC"
 },
 {
   "PRODUCT": "H27Q1T8QEM",
   "TECH": "1xnm",
   "DENSITY": "1Tb",
   "BLOCK_SIZE": "4MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC/TLC"
 },
 {
   "PRODUCT": "H27QCG882M",
   "TECH": "1xnm",
   "DENSITY": "64Gb",
   "BLOCK_SIZE": "6MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "MLC/TLC"
 },
 {
   "PRODUCT": "H27QDG8M2B",
   "TECH": "1ynm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "6MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27QEG8NDB",
   "TECH": "1ynm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "6MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27QFG8PEB",
   "TECH": "1ynm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "6MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(132ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27QEG8M2A",
   "TECH": "3D-V4",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27QFG8NDA",
   "TECH": "3D-V4",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27Q1T8PEA",
   "TECH": "3D-V4",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27Q2T8QEA",
   "TECH": "3D-V4",
   "DENSITY": "2048Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27Q2T8QAA",
   "TECH": "3D-V4",
   "DENSITY": "2048Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27Q4T8LEA",
   "TECH": "3D-V4",
   "DENSITY": "4096Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "16DP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27Q4T8LAA",
   "TECH": "3D-V4",
   "DENSITY": "4096Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "16DP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27Q1T8PQA",
   "TECH": "3D-V4",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(316ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27Q2T8QQA",
   "TECH": "3D-V4",
   "DENSITY": "2048Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(316ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H27Q4T8LQA",
   "TECH": "3D-V4",
   "DENSITY": "4096Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "16DP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(316ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFT8A1A",
   "TECH": "3D-V4",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFT8B3A",
   "TECH": "3D-V4",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFT8D4A",
   "TECH": "3D-V4",
   "DENSITY": "2048Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFT8F4A",
   "TECH": "3D-V4",
   "DENSITY": "4096Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFT8F6A",
   "TECH": "3D-V4",
   "DENSITY": "4096Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFT8G4A",
   "TECH": "3D-V4",
   "DENSITY": "8192Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "16DP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFTMA1A",
   "TECH": "3D-V4",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFTMB3A",
   "TECH": "3D-V4",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "DDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFTMD4A",
   "TECH": "3D-V4",
   "DENSITY": "2048Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "QDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFTMF4A",
   "TECH": "3D-V4",
   "DENSITY": "4096Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFTMF6A",
   "TECH": "3D-V4",
   "DENSITY": "4096Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "ODP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25QFTMG4A",
   "TECH": "3D-V4",
   "DENSITY": "8192Gb",
   "BLOCK_SIZE": "13.5MB",
   "STACK": "16DP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Now",
   "REMARK": "HS(Toggle2.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H25BFT8A1M",
   "TECH": "3D-V5",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "18MB",
   "STACK": "SDP",
   "VCC_ORG": "3.3V / x8",
   "PKG": "FBGA(152ball)",
   "AVAIL": "Q1'19",
   "REMARK": "HS(Toggle3.0)",
   "TYPE": "TLC"
 },
 {
   "PRODUCT": "H2JTCG8T21BMR",
   "TECH": "1xnm",
   "DENSITY": "64Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "1",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTDG8UD1BMR",
   "TECH": "1xnm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "2",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTEG8VD1BMR",
   "TECH": "1xnm",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "4",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTFG8YD1BMR",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "8",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTDG8UD1BMS",
   "TECH": "1xnm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "2",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "EMI Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTEG8VD1BMS",
   "TECH": "1xnm",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "4",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "EMI Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTFG8YD1BMS",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "8",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "EMI Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTCG8T21CMR",
   "TECH": "1xnm",
   "DENSITY": "64Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "1",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTFG8YD1CMR",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "8",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTFG8YD1CMS",
   "TECH": "1xnm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "8",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "EMI Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JT1T8QD1MMS",
   "TECH": "1xnm",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "8",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "EMI Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTDG8UD1CMR",
   "TECH": "1ynm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "2",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTEG8VD1CMR",
   "TECH": "1ynm",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "4",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTDG8UD1CMS",
   "TECH": "1ynm",
   "DENSITY": "128Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "2",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "EMI Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTEG8VD1CMS",
   "TECH": "1ynm",
   "DENSITY": "256Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "4",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "EMI Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTFG8PD1MMR",
   "TECH": "1ynm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "4",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JT1T8QD1MMR",
   "TECH": "1ynm",
   "DENSITY": "1024Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "8",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "Non Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H2JTFG8PD1MMS",
   "TECH": "1ynm",
   "DENSITY": "512Gb",
   "BLOCK_SIZE": "4MB",
   "STACK": "4",
   "VCC_ORG": "3.3V / x8",
   "PKG": "WLGA",
   "AVAIL": "Now",
   "REMARK": "EMI Shielded",
   "TYPE": "E3NAND"
 },
 {
   "PRODUCT": "H28U62301AMR",
   "DENSITY": "32GB",
   "TECH": "3D-V2",
   "BASE_DENSITY": "128Gb",
   "STACK": 2,
   "VCC_ORG": "3.3V / 1 & 2Lane",
   "VERSION": "UFS2.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "UFS2.1"
 },
 {
   "PRODUCT": "H28U74301AMR",
   "DENSITY": "64GB",
   "TECH": "3D-V2",
   "BASE_DENSITY": "128Gb",
   "STACK": 4,
   "VCC_ORG": "3.3V / 1 & 2Lane",
   "VERSION": "UFS2.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "UFS2.1"
 },
 {
   "PRODUCT": "H28U88301AMR",
   "DENSITY": "128GB",
   "TECH": "3D-V2",
   "BASE_DENSITY": "128Gb",
   "STACK": 8,
   "VCC_ORG": "3.3V / 1 & 2Lane",
   "VERSION": "UFS2.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "UFS2.1"
 },
 {
   "PRODUCT": "H26S6D302BMR",
   "DENSITY": "32GB",
   "TECH": "3D-V3",
   "BASE_DENSITY": "128Gb",
   "STACK": 2,
   "VCC_ORG": "3.3V / 1 & 2Lane",
   "VERSION": "UFS2.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "UFS2.1"
 },
 {
   "PRODUCT": "H28S7Q302BMR",
   "DENSITY": "64GB",
   "TECH": "3D-V3",
   "BASE_DENSITY": "128Gb",
   "STACK": 4,
   "VCC_ORG": "3.3V / 1 & 2Lane",
   "VERSION": "UFS2.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "UFS2.1"
 },
 {
   "PRODUCT": "H28S8Q302CMR",
   "DENSITY": "128GB",
   "TECH": "3D-V4",
   "BASE_DENSITY": "256Gb",
   "STACK": 4,
   "VCC_ORG": "3.3V / 1 & 2Lane",
   "VERSION": "UFS2.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "UFS2.1"
 },
 {
   "PRODUCT": "H28S9O302BMR",
   "DENSITY": "256GB",
   "TECH": "3D-V4",
   "BASE_DENSITY": "256Gb",
   "STACK": 8,
   "VCC_ORG": "3.3V / 1 & 2Lane",
   "VERSION": "UFS2.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "UFS2.1"
 },
 {
   "PRODUCT": "H28U64222MMR",
   "DENSITY": "32GB",
   "TECH": "1ynm",
   "BASE_DENSITY": "64Gb",
   "STACK": 4,
   "VCC_ORG": "3.3V / 1 & 2Lane",
   "VERSION": "UFS2.0",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "UFS2.0"
 },
 {
   "PRODUCT": "H28U78222MMR",
   "DENSITY": "64GB",
   "TECH": "1ynm",
   "BASE_DENSITY": "64Gb",
   "STACK": 8,
   "VCC_ORG": "3.3V / 1 & 2Lane",
   "VERSION": "UFS2.0",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "UFS2.0"
 },
 {
   "PRODUCT": "H26M31001HPR",
   "DENSITY": "4GB",
   "TECH": "1ynm",
   "BASE_DENSITY": "32Gb",
   "STACK": 1,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC4.5",
   "AVAIL": "Now",
   "SIZE": "11.5x13x0.8mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26M41204HPR",
   "DENSITY": "8GB",
   "TECH": "1ynm",
   "BASE_DENSITY": "64Gb",
   "STACK": 1,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x0.8mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26M41208HPR",
   "DENSITY": "8GB",
   "TECH": "1ynm",
   "BASE_DENSITY": "64Gb",
   "STACK": 1,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x0.8mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26M52208FPR",
   "DENSITY": "16GB",
   "TECH": "1ynm",
   "BASE_DENSITY": "64Gb",
   "STACK": 2,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x0.8mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26M64208EMR",
   "DENSITY": "32GB",
   "TECH": "1ynm",
   "BASE_DENSITY": "64Gb",
   "STACK": 4,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26M78208CMR",
   "DENSITY": "64GB",
   "TECH": "1ynm",
   "BASE_DENSITY": "64Gb",
   "STACK": 8,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26M88002AMR",
   "DENSITY": "128GB",
   "TECH": "3D-V2",
   "BASE_DENSITY": "128Gb",
   "STACK": 8,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26T87001CMR",
   "DENSITY": "128GB",
   "TECH": "3D-V4",
   "BASE_DENSITY": "256Gb",
   "STACK": 4,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26M51002KPR",
   "DENSITY": "16GB",
   "TECH": "1znm",
   "BASE_DENSITY": "128Gb",
   "STACK": 1,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x0.8mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26M62002JPR",
   "DENSITY": "32GB",
   "TECH": "1znm",
   "BASE_DENSITY": "128Gb",
   "STACK": 2,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x0.8mm",
   "TYPE": "eMMC"
 },
 {
   "PRODUCT": "H26M74002HMR",
   "DENSITY": "64GB",
   "TECH": "1znm",
   "BASE_DENSITY": "128Gb",
   "STACK": 4,
   "VCC_ORG": "3.3V / x4, x8",
   "VERSION": "MMC5.1",
   "AVAIL": "Now",
   "SIZE": "11.5x13x1.0mm",
   "TYPE": "eMMC"
 }
];