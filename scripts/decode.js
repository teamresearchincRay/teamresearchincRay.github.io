var partNumber;
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
function decode (){
	$( "#myTableBody" ).empty();
	var line;
	var lines = $('#partNumListarea').val().replace(/\n/g,"###").replace(/\s/g,"@@").split('###');
	console.log(lines);
	for (var i = 0; i<lines.length; i++){
		line = lines[i].split('@@');
		console.log(line[0]);
		
		density = line[2];
		console.log("density" + line[2].slice(-1));
		if (line[2].slice(-1) == "M" ||line[2].slice(-1) == "MB" ){
			density = (density.slice(0,-1))/1024;
			console.log("density" + density);
		}else{
			density = (density.slice(0,-1));
		}
		partNumber = line[4];
		//console.log(partNumber[1]);

		//check type
		switch (partNumber[1]){
			case "M":
				type="Module";
			break;
			case "5":
				type="IC";
			break;
			default:
				type="Unkown";

		}
		console.log("type is " + type);
		//==================================================Module============================
		if(type == "Module"){
			if(line[3] == "DDR3"){
				voltage="N/A";
				get_speedDDR3(partNumber[14],partNumber[15]);
			}else if (line[3]=="DDR4"){
				voltage="1.2V";
				get_speedDDR4(partNumber[14],partNumber[15]);
			}else if(line[3] == "DDR2"){
				voltage ="N/A";
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
			ICQTY = (64/width*rank)/package;
			
			console.log("ICQTY" + ICQTY);
			totalCapacity = ICQTY*density/8;
			if (package == 2 ){

				ICQTY = ICQTY + " DDP";
			}else if (package == 4){
				ICQTY = ICQTY + " QDP";
			}
			$("#myTableBody").append('<tr><td>'+(i+1)+'</td><td>'
			+line[0]+'</td><td>'
			+line[1]+'</td><td>'
			+line[2]+'</td><td>'
			+line[3]+'</td><td>'
			+line[4]+'</td><td>'
			+type+'</td><td>'
			+voltage+'</td><td>'
			+ICConfig+'</td><td>'
			+rank+'</td><td>'
			+ICQTY+'</td><td>'
			+totalCapacity+"G"+'</td><td>'
			+moduleType+'</td><td>'
			+speed+'</td></tr>');

		} else if (type == "IC"){//======================IC==================
			//check voltage
			get_voltage(partNumber[3]);
			//check depth
			get_depth(partNumber[4],partNumber[5]);

			//check width
			get_width(partNumber[6]);
			//check speed 
			if(line[3] == "DDR3"){
				get_speedDDR3(partNumber[12],partNumber[13]);
			}else if (line[3]=="DDR4"){
				get_speedDDR4(partNumber[12],partNumber[13]);
			}else if(line[3] == "DDR2"){
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
			rank = depth/height;
			ICQTY = 64/width*rank;
			$("#myTableBody").append('<tr><td>'+(i+1)+'</td><td>'
			+line[0]+'</td><td>'
			+line[1]+'</td><td>'
			+line[2]+'</td><td>'
			+line[3]+'</td><td>'
			+line[4]+'</td><td>'
			+type+'</td><td>'
			+voltage+'</td><td>'
			+ICConfig+'</td><td>'
			+"N/A"+'</td><td>'
			+"N/A"+'</td><td>'
			+"N/A"+'</td><td>'
			+"N/A"+'</td><td>'
			+speed+'</td></tr>');


		}//IC
	
		
	}//for (var i = 0; i<lines.length; i++)
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
				case "S":
					voltage="1.8V";
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