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
function decode (){
	$( "#myTableBody" ).empty();
	var line;
	var lines = $('#partNumListarea').val().replace(/\n/g,"###").replace(/\s/g,"@@").split('###');
	console.log(lines);
	for (var i = 0; i<lines.length; i++){
		line = lines[i].split('@@');
		console.log(line[0]);
		
		density = line[2];
		console.log(line[2]);
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
			}
			get_depth(partNumber[4],partNumber[5]);

			get_width(partNumber[11]);
			get_module_type(partNumber[6]);

			height = density.slice(0,-1) / width;
			console.log("height " + height);
			ICConfig = height + "G*"+width;
			rank = depth/height;
			console.log("rank " + rank);
			ICQTY = 64/width*rank;
			console.log("ICQTY" + ICQTY);
			totalCapacity = ICQTY*density.slice(0,-1)/8;
			$("#myTableBody").append('<tr><td>'+(i+1)+'</td><td>'
			+line[0]+'</td><td>'
			+line[1]+'</td><td>'
			+line[2]+'</td><td>'
			+line[3]+'</td><td>'
			+line[4]+'</td><td>'
			+line[5]+'</td><td>'
			+type+'</td><td>'
			+voltage+'</td><td>'
			+ICConfig+'</td><td>'
			+totalCapacity+"G"+'</td><td>'
			+moduleType+'</td><td>'
			+speed+'</td></tr>');

		} else if (type == "IC"){
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
			}


			//get_module_type(partNumber[6]);

			height = density.slice(0,-1) / width;
			console.log("height " + height);
			ICConfig = height + "G*"+width;
			rank = depth/height;
			ICQTY = 64/width*rank;
			$("#myTableBody").append('<tr><td>'+(i+1)+'</td><td>'
			+line[0]+'</td><td>'
			+line[1]+'</td><td>'
			+line[2]+'</td><td>'
			+line[3]+'</td><td>'
			+line[4]+'</td><td>'
			+line[5]+'</td><td>'
			+type+'</td><td>'
			+voltage+'</td><td>'
			+ICConfig+'</td><td>'
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
function appendTable(){

}