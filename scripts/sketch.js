const mias = {
  "c16": 16,
  "c8": 8,
  "c4": 4,
  "c2": 2,
  1: 1,
  2: 0.5,
  4: 0.25,
  8: 0.125,
  16: 0.0625,
  32: 0.03125,
  64: 0.015625,
  dd2: 0.875,
  d2: 0.75,
  dd4: 0.4375,
  d4: 0.375,
  "4t": 0.21875,
  dd8: 0.21875,
  d8: 0.1875,
  "8t": 0.109375,
  "16t": 0.0546875,
  dd16: 0.109375,
  d16: 0.09375,
};
var Mias = {};
var suite;
var solresol;
var inputfile;
var nameFile = "";
var nameFileTrack="";
var resultParts=[];
var tracks=[]
var escribe;

function handleFiles() {
  const fileList = this.files; /* now you can work with the file list */
  const file = fileList[0];
  console.log(file);
  nameFile = file.name;
  var reader = new FileReader();
  reader.onload = function (e) {
    suite = new Midi(e.target.result);
   
    //console.log(JSON.stringify(midi, undefined, 2));

    //suite = loadJSON(JSON.parse(midi))
    //suite =midi
    //console.log(JSON.stringify(suite));
    toSolresolR();
  };
  reader.readAsArrayBuffer(file);
}

function preload() {
  solresol = loadJSON( "https://raw.githubusercontent.com/josepssv/solresol_rhythm/main/solresol_02.json"
  );
  //suite = loadJSON(nameFile, toSolresolR);
 
  //midi =  Midi.fromUrl("BachSuite1.mid");
}
//const midi = new Midi()

function setup() {
  noCanvas();
  createMetaTag()
  //input = select("#file-input")
  inputfile = document.getElementById("file-input");
  inputfile.addEventListener("change", handleFiles, false);
}

function toSolresolR() {
  select("#info1").html("<h3>" + nameFile + "</h3>");
  //Mias=equalizePPQ(0.25,0.19572326666666667)
  var ntrack = 0;
  var nnotes = [];
  var cad = "";
  var contt = 1;
  for (var j = 0; j < suite.tracks.length; j++) {
    if (suite.tracks[j].notes.length > 0) {
      //ntrack=j;
      nnotes = suite.tracks[j].notes.length;
      //nnotes.push({channel:suite.tracks[j].channel,nnotes:suite.tracks[j].notes.length})
      cad +=
        '<button style="cursor:pointer;padding:5px;"id="nt' +
        j +
        '" onclick="toSolresolP(' +
        j +
        ')">' +
        contt +
        ".  " +
        suite.tracks[j].instrument.name +
        ". Num Notes: " +
        nnotes +
        "</button>";

      contt++;
      if (contt % 5 == 0) {
        cad += "<br>";
      }
      //nnotes=suite.tracks[j].notes.length
      //break;

      //nnotes.push({channel:suite.tracks[j].channel,nnotes:suite.tracks[j].notes.length,notes:[...suite.tracks[j].notes]})
      //}
    }
  }
  select("#info1").html(cad + "<hr>", 1);
    select("#info2").html("");
  
   select("#playerzone").hide()
}


function otro(nt, compi) {
  tracks[nt].addEvent(
    new MidiWriter.ProgramChangeEvent({ instrument: compi[0] })
  );
  tracks[nt].addEvent(
    new MidiWriter.NoteEvent({
      velocity: compi[1],
      wait: compi[2],
      pitch: compi[3],
      duration: compi[4],
      channel: compi[5],
      repeat: compi[6],
      sequential: compi[7],
    })
  );
}
function toSolresolP(ntrack) {
  
  var PPQ1 = 120;
  var PPQ2 = suite.header.ppq;
  Mias = equalizePPQ(PPQ1, PPQ2);
  
  //Mias={...mias}
  //console.log(JSON.stringify(Mias));
  
  var Notes = [...suite.tracks[ntrack].notes]
  tracks=[]
  //console.log(JSON.stringify(suite.header));
   var nt = 0;
   tracks[nt] = new MidiWriter.Track();
  var ts=suite.header.timeSignatures[0].timeSignature
  tracks[nt].setTimeSignature(ts[0], ts[1]);
 //tracks[nt].setTempo(120);

 

  //tracks[nt].setTimeSignature(suite.header.timeSignatures[0],   suite.header.timeSignatures[1]);
  tracks[nt].setTempo(suite.header.tempos[0].bpm);
   var instr=suite.tracks[ntrack].instrument.number
   var compo=[]
   
  for(var a=0;a<Notes.length;a++){
      compo=[]
      compo[0]=instr
      compo[1]=''+parseInt(Notes[a].velocity*100);
      compo[2]=0
      compo[3]=[Notes[a].name]
      compo[4]='T'+Notes[a].durationTicks
      compo[5]= 1
      compo[6]=1
      compo[7]=false
    //console.log(JSON.stringify(compo))
    otro(nt,compo)
  }
  nameFileTrack=nameFile+'_'+ntrack+'_'+suite.tracks[ntrack].instrument.name
  termina()
   select("#playerzone").show()
  select("#expi").show()
  select("#info").html('')
  
 var playi = select("#player15");
     playi.attribute("src",escribe.dataUri() );
  select("#info2").html("");

  var cad = [];
  var pcad = [];
  var nome = "";
  var cad2 = "";
  var cadTrans = "";
  var duration = [];
  var durationVal = [];
  var presure = 0;
  var sure=0 
  var complet=0
  for (var a = 1; a < Notes.length; a++) {
    nome = Notes[a - 1].name;
    var dura = Notes[a - 1].durationTicks / PPQ2;
    var dure = searchAprox(dura);
    duration.push(dure+'');
    durationVal.push(dura);
    sure = durationVal.reduce((psum, b) => psum + b, 0);
    
    pcad.push(nome);
    var suse = false;
    if (durationVal.length > 0) {
      suse = searchAproxAcc(Mias["1"], presure, sure);
    }
    
    presure = sure;
  complet = ''
  if(sure > Mias["1"]){ 
    complet = 'new';
    durationVal = [];
   
  }
    //complet=tente
    //select("#info2").html('<b style="color:#ff00dd">'+complet+'</b>    Aprox:'+suse+' Suma:'+ sure+' Ticks:'+ Notes[a - 1].durationTicks+' TicskPropor:'+JSON.stringify(dura) +  "<br>", 1   );
    
    
 /* var pa ='Note name: '+nome+' '+Notes[a - 1].durationTicks+' '+Notes[a].durationTicks+' '+dura+' '+dure+ ''
    pa+='\n tiempos '+ ' '+durationVal+' '+ presure+' '+sure+' '+suse
      pa+='\n Notes '+ ' '+JSON.stringify(Notes[a-1])+' '+ JSON.stringify(Notes[a])
    console.log(pa)
*/
    //select('#info2').html(Mias["1"]+' '+presure+' '+sure+' '+suse+'<br>',1)
   
    if (complet=='new') {
      pcad.pop();
      duration.pop();
       //cad2+='<hr>'
    
      var tempoNotes = uniqueRepeat(duration, pcad);
      var pcode = [];
  // select("#info2").html(     JSON.stringify(tempoNotes) + "<br>", 1   );
     // console.log('tempoNotes '+JSON.stringify(tempoNotes))
    //console.log('pcad y dur '+JSON.stringify(pcad),JSON.stringify(duration))
  
      
      
     // continue;

//////////////--
 for (var k = 0; k < tempoNotes.length; k++) {
         if(tempoNotes[k]!==false){
          //for (var r = 0; r < tempoNotes[k].length; r++) {
             // select("#info2").html( 'duration' + "" + "pcad" + "<br>" + JSON.stringify(tempoNotes[k][1]) + "<hr>", 1 );
 
            var solsi1 = scientificToDoremi(tempoNotes[k][1]);
            var solsi = scientificToDoremi0(tempoNotes[k][1]);
         
            
            solsi = "" + solsi.charAt(0).toUpperCase() + solsi.slice(1);
           //var solre=scientificToSolresol(tempoNotes[k][1])
            var solre=searchConcept(solsi); 
           
            pcode.push(tempoNotes[k][0])
            pcode.push(tempoNotes[k][1]);
            pcode.push(solre);
            pcode.push(solsi);
            
           var unify=uniqueRepeat2(tempoNotes[k][0])
           //-->var unify2=uniqueKey(unify)
           var solresolry=unify+solsi1
            pcode.push(solresolry);
        /*   resultParts.durations.push(tempoNotes[k][0])
           resultParts.notes.push(tempoNotes[k][1])
            resultParts.texto.push(solre[0])
          resultParts.Solresol.push(solsi)
           resultParts.Srhythm.push(solresolry)
           */
            cad.push([...pcode]);
           cad2+='<p><b>'+solre[0]+'</b> '+solsi+' '+solresolry+'</p>'
          
      }

     }


      //select('#info2').html(''+JSON.stringify(pcode)+'<hr>',1)
      //pcad.push(solsi)
      //pcad.push(tempoNotes.join('')+solsi1)
      //var pcod=tempoNotes
      //cad.push(tempoNotes)
      //cad.push([...pcad])
      //cad2+='4'+solsi+' '
      //cad3=1/4+solsi+' '
      //cadTrans += findValue(solsi)

      //-->  a--;
      presure = 0;
      pcad = [];
      duration = [];
      durationVal = [];
 
    }
   //////////////--  
    
    
  }

  
   resultParts=[...cad]
  
 // console.log('cad:',JSON.stringify(cad))
  var textos=filtra(resultParts,2,0)
  //var notas=filtra(resultParts,0)
  //console.log('textos ',JSON.stringify(notas))
  select("#info2").html(textos.join(' ') + '<hr>', 1);
   select("#info2").html(cad2+'<hr>', 1);
  select("#info2").html(JSON.stringify(cad), 1);
}

function equalizePPQ(x, y) {
  const scale = y / x;
  console.log(scale);
  const result = {};
  for (const key in mias) {
    result[key] = mias[key] * scale;
  }
  return result;
}
 const keyExist = (objectName, keyName) => {
    let keyExist = Object.keys(objectName).some(key => key === keyName);
    return keyExist;
};
function uniqueKey(cad) {
  var ncad=cad.length
  var keylist={"80":"80","40":"40","20":"20","1":"R","2":"B","4":"1","8":"2","16":"4","32":"8"}
  if(ncad==1){
    var keli=keyExist(keylist,cad)
   if(keli){
     return keylist[cad]
   }
    return cad
  }
}
function uniqueRepeat(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  var result = [];
  var subArrayLength;

  if (arr1.length % 4 === 0) {
    subArrayLength = 4;
  } else if (arr1.length % 3 === 0) {
    subArrayLength = 3;
  } else {
    subArrayLength = 2;
  }

  for (var i = 0; i < arr1.length; i += subArrayLength) {
    var subArr1 = arr1.slice(i, i + subArrayLength);
    var subArr2 = arr2.slice(i, i + subArrayLength);
    result.push([subArr1, subArr2]);
  }

  if (arr1.length % subArrayLength !== 0) {
    var lastSubArray = result.pop();
    var lastSubArray1 = lastSubArray[0];
    var lastSubArray2 = lastSubArray[1];

    var remaining1 = arr1.slice(-1 * (arr1.length % subArrayLength));
    var remaining2 = arr2.slice(-1 * (arr2.length % subArrayLength));

    lastSubArray1.push(...remaining1);
    lastSubArray2.push(...remaining2);

    result.push([lastSubArray1, lastSubArray2]);
  }

  return result;
}



function uniqueRepeat2(arr) {
  // Comprobamos si todos los elementos del array son iguales
  if (arr.every((elem) => elem === arr[0])) {
    // Devolvemos un array con un solo elemento
    return [arr[0]];
  } else {
    // Devolvemos el array original
    return arr;
  }
}

function searchAprox(dato) {
  let minDiff = Infinity;
  let minKey = null;
  for (const key in Mias) {
    if (Object.hasOwnProperty.call(Mias, key)) {
      const diff = Math.abs(Mias[key] - dato);
      if (diff < minDiff) {
        minDiff = diff;
        minKey = key;
      }
    }
  }
  return minKey;
}

function searchAproxAcc(dato, duration1, duration2) {
  const approxKey = searchAprox(dato);
  const prevKey = getPrevKey(approxKey);
  const nextKey = getNextKey(approxKey);
  const approxValue = Mias[approxKey];
  const prevValue = Mias[prevKey];
  const nextValue = Mias[nextKey];
  return (
    (prevValue <= dato &&
      dato <= approxValue &&
      duration1 <= prevValue &&
      prevValue <= duration2) ||
    (approxValue === dato &&
      duration1 <= approxValue &&
      approxValue <= duration2) ||
    (approxValue <= dato &&
      dato <= nextValue &&
      duration1 <= nextValue &&
      nextValue <= duration2)
  );
}

function getPrevKey(key) {
  const keys = Object.keys(Mias);
  const index = keys.indexOf(key);
  return index > 0 ? keys[index - 1] : keys[0];
}

function getNextKey(key) {
  const keys = Object.keys(Mias);
  const index = keys.indexOf(key);
  return index < keys.length - 1 ? keys[index + 1] : keys[keys.length - 1];
}

function searchAproxAcc2(dato, durationVal) {
  let minDiff = Infinity;
  let minKey = null;
  for (const key in Mias) {
    if (Object.hasOwnProperty.call(Mias, key)) {
      const diff = Math.abs(Mias[key] - dato);
      const accDiff = Math.abs(Mias[key] - durationVal);
      const totalDiff = diff + accDiff;
      if (totalDiff < minDiff) {
        minDiff = totalDiff;
        minKey = key;
      }
    }
  }
  return minKey;
}

function findValue(key) {
  for (const prop in solresol) {
    if (prop.toLowerCase() === key.toLowerCase()) {
      return solresol[prop];
    }
  }
  return false;
}

function searchConcept(value) {
  value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  const keys = [];
  for (const [key, val] of Object.entries(solresol)) {
    if (val.toLowerCase() === value.toLowerCase()) {
      keys.push(key);
    }
  }
  return keys;
}
function doremiToScientific(doremiNotation) {
  const noteMap = {
    do: "C",
    re: "D",
    mi: "E",
    fa: "F",
    sol: "G",
    la: "A",
    si: "B",
  };

  const notes = doremiNotation.split(" ");

  let scientificNotation = [];

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    llave0note != "";
    let letter = note[i].toLowerCase();
    let octave = 4;
    let duration = 1;
    let j = 1;
    while (j < note.length) {
      let char = note[j];
      if (char === ",") {
        octave--;
      } else if (char === "'") {
        octave++;
      } else {
        duration = parseInt(char);
      }
      j++;
    }
    scientificNotation.push(
      `${noteMap[letter.toUpperCase()]}${octave}:${duration}`
    );
  }

  return scientificNotation;
}

function scientificToDoremi(scientificNotation) {
  const doremiMap = {
    C: "do",
    D: "re",
    E: "mi",
    F: "fa",
    G: "sol",
    A: "la",
    B: "si",
    "C#": "dó",
    "D#": "ré",
    "E#": "mí",
    "F#": "fá",
    "G#": "sól",
    "A#": "lá",
    "B#": "sí",
  };

  let doremiNotation = "";

  for (let i = 0; i < scientificNotation.length; i++) {
    const note = scientificNotation[i];
    var letter = note[0];
    if (note[1] == "#") {
      letter += "#";
    }
    const octave = parseInt(note[note.length - 1]);
    const doremiNote = doremiMap[letter];
    doremiNotation += doremiNote;
    if (octave <= 3) {
      doremiNotation += ",".repeat(3 - octave);
    } else {
      doremiNotation += "'".repeat(octave - 3);
    }
  }
  doremiNotation =
    "" + doremiNotation.charAt(0).toUpperCase() + doremiNotation.slice(1);
  return doremiNotation;
}

function scientificToDoremi0(scientificNotation) {
  const doremiMap = {
    C: "do",
    D: "re",
    E: "mi",
    F: "fa",
    G: "sol",
    A: "la",
    B: "si",
  };

  let doremiNotation = "";

  for (let i = 0; i < scientificNotation.length; i++) {
    const note = scientificNotation[i];
    const letter = note[0];
    const octave = parseInt(note[1]);
    const doremiNote = doremiMap[letter];
    doremiNotation += doremiNote;
    if (octave <= 3) {
      doremiNotation += "".repeat(3 - octave);
    } else {
      doremiNotation += "".repeat(octave - 3);
    }
  }

  return doremiNotation;
}

function transParts4(nums, compas) {
  const sum = nums.reduce((acc, curr) => acc + curr, 0);
  const decimalValues = Object.values(mias);

  const res = nums.map((num) => {
    const decimal = (num * compas) / sum;
    const closestDecimal = decimalValues.reduce((a, b) => {
      return Math.abs(b - decimal) < Math.abs(a - decimal) ? b : a;
    });
    return Object.keys(mias).find((key) => mias[key] === closestDecimal);
  });

  const totalDecimalValue = res.reduce((acc, curr) => acc + mias[curr], 0);
  const texto = res
    .map((symbol, index) => `${index + 1}: ${symbol} (${mias[symbol]})`)
    .join(", ");

  return {
    result: res,
    texto: `Valores: ${texto}. Suma: ${totalDecimalValue}. Compás: ${compas}`,
  };
}

function filtra(arr, n, r) {
  return arr
    .filter(subArr => subArr.length > n)
    .map(subArr => {
      if (Array.isArray(subArr[n])) {
        return r !== undefined ? subArr[n][r] : subArr[n];
      } else {
        return subArr[n];
      }
    });
}
function filtra2(arr, n) {
  return arr
    .filter(subArr => subArr.length > n)
    .map(subArr => subArr[n]);
}

function termina() {
  //console.log(JSON.stringify(tracks))
  escribe = new MidiWriter.Writer(tracks);
  charged();
}

function charged() {
  var playi = select("#player15");
  var expi = select("#expi");
  var infot = select("#infotrack");
  var info = select("#info");
  expi.show();
  expi.mousePressed(function () {
     info.html(
      '<br><a id="linktext" download="'+nameFileTrack+'"  href="' +
        escribe.dataUri() +
        '">'+nameFileTrack+'.mid</a>&nbsp;' +
        //'<a id="linktextWav" href="' +
        //srcw +
        //'" target="_blank">Wav file</a>'+
        "<p>&nbsp;</p>" +
        "" +
        "" +
        "<p>&nbsp;</p>"
    );

    expi.hide();

    var lise = select("#linktext");
    lise.mousePressed(function () {
      setTimeout(function () {
        lise.hide();
      }, 2000);
    });
  });
  select("#section15 midi-visualizer").hide();
  playi.attribute("src", escribe.dataUri());
  playi.mouseClicked(function () {
    select("#section15 midi-visualizer").show();
  });
  //var plavi=select('#section15 midi-visualizer')
  //console.log(plavi)
  var nn=0
  var contnotes=0

  //console.log(resultParts)
   var div = document.getElementById("player15");
  div.addEventListener("note", (event) => {
    //console.log(JSON.stringify(event.detail));
    //soundsR pitch=32
    var piti = event.detail.note.pitch;
    var volu = event.detail.note.velocity;
    var instru = event.detail.note.instrument;
    var seta = event.detail.note.startTime;
    var chante = event.detail.note.program;
  
    var wordText=resultParts[nn][2][0]
    var wordSol=resultParts[nn][3]
  infot.html(wordText+' '+ wordSol)
   
    if(nn>resultParts.length-1){nn=0;contnotes=0;}
     
    contnotes++
  //console.log(resultParts.notes)
  if(contnotes>=resultParts[nn][0].length){
     contnotes=0; nn++;
   }
});
}

function createMetaTag() {

  //https://openprocess4.org/sketch/790331

  //Mobile Devices by Oren Shoham

  let meta = createElement("meta");

  meta.attribute("name", "viewport");

  meta.attribute(

    "content",

    "user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height"

  );

  let head = select("head");

  meta.parent(head);

}
