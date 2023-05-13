const mias = {
  c8: 8,
  c4: 4,
  c2: 2,
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
var PPQ1 = 120;
var PPQ2 = 120;
var Mias = {};
var suite;
var solresol;
var inputfile;
var nameFile = "";
var nameFileTrack = "";
var resultParts = [];
var tracks = [];
var escribe;
var BPM = 120;
var divi;
var contBeat = 1;
var contEvent=1
var solre = "";
var cumulNote = "";
var cumulSolr = "";
var cumulAbc = "";
var cumulRhy = "";
var cumulConcept = "";

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
  solresol = loadJSON(
    "https://raw.githubusercontent.com/josepssv/solresol_rhythm/main/solresol_02.json"
  );
  //suite = loadJSON(nameFile, toSolresolR);

  //midi =  Midi.fromUrl("BachSuite1.mid");
}
//const midi = new Midi()

function setup() {
  noCanvas();
  createMetaTag();
   divi = document.getElementById("player15");
  divi.addEventListener("note", eventNote, false);
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

  select("#playerzone").hide();
}

function otro(nt, compi) {
  tracks[nt].addEvent(
    new MidiWriter.ProgramChangeEvent({
      instrument: compi[0],
      channel: compi[5],
    })
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
  PPQ1 = 120;
  PPQ2 = suite.header.ppq;
  Mias = equalizePPQ(PPQ1, PPQ2);

  //Mias={...mias}
  //console.log(JSON.stringify(Mias));

  var Notes = [...suite.tracks[ntrack].notes];
  tracks = [];
  //console.log(JSON.stringify(suite));
  var nt = 0;
  tracks[nt] = new MidiWriter.Track();
  var ts = [4, 4];
  if (suite.header.timeSignatures.length > 0) {
    ts = suite.header.timeSignatures[0].timeSignature;
  }
  var instr = Number(suite.tracks[ntrack].instrument.number);
  var instrn = suite.tracks[ntrack].instrument.name;
  var channel = suite.tracks[ntrack].channel + 1;
  tracks[nt].setTimeSignature(ts[0], ts[1]);
  //tracks[nt].addInstrumentName(instrn)
  tracks[nt].addEvent(
    new MidiWriter.ProgramChangeEvent({ instrument: instr, channel: channel })
  );
  //tracks[nt].setTempo(120);
  BPM = suite.header.tempos[0].bpm;
  //tracks[nt].setTimeSignature(suite.header.timeSignatures[0],   suite.header.timeSignatures[1]);
  tracks[nt].setTempo(BPM);
  console.log(JSON.stringify(suite.tracks[ntrack].instrument));

  //console.log('instr ',instr)
  var compo = [];
  var pretime=[0,0]
  var memonote=[]
  for (var a = 0; a < Notes.length; a++) {
    pretime[1]=Notes[a].time
    
    if(pretime[0]==pretime[1]){
      memonote.push(Notes[a].name)
    }else{
    memonote.push(Notes[a].name)
    compo = [];
    compo[0] = instr;
    compo[1] = "" + parseInt(Notes[a].velocity * 100);
    compo[2] = 0;
    //compo[3] = [Notes[a].name];
    compo[3] = memonote;
    compo[4] = "T" + Notes[a].durationTicks;
    compo[5] = channel;
    compo[6] = 1;
    compo[7] = false;
    //console.log(JSON.stringify(Notes[a]))
    otro(nt, compo);
    memonote=[]
    }
    pretime[0]=Notes[a].time
  }
  nameFileTrack =
    nameFile + "_" + ntrack + "_" + suite.tracks[ntrack].instrument.name;
  termina();
  select("#playerzone").show();
  select("#expi").show();
  select("#info").html("");

  var playi = select("#player15");
  playi.attribute("src", escribe.dataUri());
  select("#info2").html("");
  //notesBlock(ntrack);
}

function notesBlock(ntrack) {
  PPQ2 = suite.header.ppq;

  var notesSolr = [];
  var notesSol = "";
  var notesAbc = "";
  var notesDur;
  var Notes = [...suite.tracks[ntrack].notes];
  var fou = [];
  var four = [];
  var signis = [];
  var notis = [];
  var nomes = [];
  var duration = [];
  var solre = [];
  var dures = "";
  var numeration = [];
  var contBeat = 1;
  for (var a = 0; a < Notes.length; a++) {
    var nome = Notes[a].name;
    // console.log(JSON.stringify(Notes[a]))
    var dura = Notes[a].durationTicks / PPQ2;
    var dure = searchAprox(dura);
    dures += dure + " ";
    var piti = abcToDoremi(nome);
    numeration[a] = a + 1 + "/" + contBeat + ": " + nome + " " + piti + " ";
    notesAbc += nome + " ";
    nomes.push(nome);
    notesSol += piti;
    //var dures1=proporDurations(dures.split(' '),pitir.split(' '))
    //var mix=mixArray(pitir,dures1)

    var foj = notesSol;
    //console.log(foj)
    solre = searchConcept(foj);
    var signo = solre[0];
    if (signo === undefined) {
      signo = "&nbsp;";
    }
    duration.push(dures);
    notis.push(notesAbc);
    signis.push(signo);
    fou.push(capital(notesSol));
    ///// FORMAT SOLRESOL RHYTHM
    var dupro = dures;
    dupro = dupro.slice(0, -1);
    var duprop = dupro.split(" ");
    var duresP = proporDurations(duprop);
    var noter = [];
    var pitir = "";
    for (var k = 0; k < nomes.length; k++) {
      pitir = abcToDoremir(nomes[k], duresP[k]);
      notesSolr.push(pitir);
      if (k == 0) {
        noter.push(capital(pitir));
      } else {
        noter.push(pitir);
      }
      // console.log('pitir', pitir)
    }
    var pronu = proporDurNumber(duprop);
    //console.log('ProporDures', duprop,  pronu)
    //JSON.stringify(duresP),JSON.stringify(noter))
    //four.push(capital(notesSolr.join('')));
    four.push(pronu + "" + noter.join(""));
    if (contBeat == 4) {
      dures = "";
      notesAbc = "";
      solre = "";
      notesSol = "";
      nomes = [];
      notesSolr = [];
    }
    contBeat++;
    if (contBeat > 4) {
      contBeat = 1;
    }
  }
  resultParts = [];
  resultParts[0] = [...numeration];
  resultParts[1] = [...duration];
  resultParts[2] = [...notis];
  resultParts[3] = [...signis];
  resultParts[4] = [...fou];
  resultParts[5] = [...four];

  var mixParts = mixArrays(resultParts);
  //var textos = finder(resultParts, [2,4]);
  //-->var textos = finder4(mixParts, [0, 5, 2]); // [test in, number of elements, index]
  //-->var onlyFour = finderAll(mixParts, [0, 5]);

  //var notas=filtra(resultParts,0)
  //console.log('textos ',JSON.stringify(notas))
  //var textos = resultParts[2]
  //select("#info2").html(textos.join(" ") + "<hr>", 1);
  //-->select("#info2").html(textos + "<hr>", 1);
  //select("#info2").html(cad2 + "<hr>", 1);
  //select("#info2").html(onlyFour.join("<br>"), 1);
  select("#info2").html(mixParts.join("<br>"), 1);
}

function capital(cap) {
  return cap.charAt(0).toUpperCase() + cap.slice(1);
}
function notesBlock0() {
  var cad = [];
  var pcad = [];
  var nome = "";
  var cad2 = "";
  var cadTrans = "";
  var duration = [];
  var durationVal = [];
  var presure = 0;
  var sure = 0;
  var complet = 0;
  for (var a = 1; a < Notes.length; a++) {
    nome = Notes[a - 1].name;
    // console.log(JSON.stringify(Notes[a]))
    var dura = Notes[a - 1].durationTicks / PPQ2;
    var dure = searchAprox(dura);
    duration.push(dure + "");
    durationVal.push(dura);
    sure = durationVal.reduce((psum, b) => psum + b, 0);

    pcad.push(nome);
    var suse = false;
    if (durationVal.length > 0) {
      suse = searchAproxAcc(Mias["1"], presure, sure);
    }

    presure = sure;
    complet = "";
    if (sure > Mias["1"]) {
      complet = "new";
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

    if (complet == "new") {
      pcad.pop();
      duration.pop();
      //cad2+='<hr>'

      var tempoNotes = uniqueRepeat(duration, pcad);
      var pcode = [];
      // select("#info2").html(     JSON.stringify(tempoNotes) + "<br>", 1   );
      // console.log('tempoNotes '+JSON.stringify(tempoNotes))
      //console.log('pcad y dur '+JSON.stringify(pcad),JSON.stringify(duration))

      var iniTime = Notes[a].time;

      // continue;

      //////////////--
      for (var k = 0; k < tempoNotes.length; k++) {
        if (tempoNotes[k] !== false) {
          //for (var r = 0; r < tempoNotes[k].length; r++) {
          // select("#info2").html( 'duration' + "" + "pcad" + "<br>" + JSON.stringify(tempoNotes[k][1]) + "<hr>", 1 );

          var solsi1 = scientificToDoremi(tempoNotes[k][1]);
          var solsi = scientificToDoremi0(tempoNotes[k][1]);

          solsi = "" + solsi.charAt(0).toUpperCase() + solsi.slice(1);
          //var solre=scientificToSolresol(tempoNotes[k][1])
          var solre = searchConcept(solsi);

          pcode.push(tempoNotes[k][0]);
          pcode.push(tempoNotes[k][1]);
          pcode.push(solre);
          pcode.push(solsi);

          var unify = uniqueRepeat2(tempoNotes[k][0]);
          //-->var unify2=uniqueKey(unify)
          var solresolry = unify + solsi1;
          pcode.push(solresolry);
          pcode.push(iniTime);
          /*   resultParts.durations.push(tempoNotes[k][0])
           resultParts.notes.push(tempoNotes[k][1])
            resultParts.texto.push(solre[0])
          resultParts.Solresol.push(solsi)
           resultParts.Srhythm.push(solresolry)
           */
          cad.push([...pcode]);
          cad2 +=
            "<p><b>" + solre[0] + "</b> " + solsi + " " + solresolry + "</p>";
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

  resultParts = [...cad];

  // console.log('cad:',JSON.stringify(cad))
  var textos = filtra(resultParts, 2, 0);
  //var notas=filtra(resultParts,0)
  //console.log('textos ',JSON.stringify(notas))
  select("#info2").html(textos.join(" ") + "<hr>", 1);
  select("#info2").html(cad2 + "<hr>", 1);
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
  let keyExist = Object.keys(objectName).some((key) => key === keyName);
  return keyExist;
};
function uniqueKey(cad) {
  var ncad = cad.length;
  var keylist = {
    80: "80",
    40: "40",
    20: "20",
    1: "R",
    2: "B",
    4: "1",
    8: "2",
    16: "4",
    32: "8",
  };
  if (ncad == 1) {
    var keli = keyExist(keylist, cad);
    if (keli) {
      return keylist[cad];
    }
    return cad;
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

function abcToDoremi(abcNote) {
  const notes = {
    C: "do",
    "C#": "do",
    D: "re",
    "D#": "re",
    Db: "re",
    E: "mi",
    Eb: "mi",
    F: "fa",
    "F#": "fa",
    G: "sol",
    "G#": "sol",
    Gb: "sol",
    A: "la",
    "A#": "la",
    Ab: "la",
    B: "si",
    Bb: "si",
  };

  const octaves = {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
  };

  //const abcRegex = /^([A-G])(#{0,2}|b{0,2})(\d)$/;
  const abcRegex = /^([A-G])(#{0,2}|b{0,2})(-?\d)$/;
  const match = abcNote.match(abcRegex);

  if (match === null) {
    throw new Error("Invalid note: " + abcNote);
    // or return null; or return some default value;
    console.log("falseNote", abcNote);
    return "";
  }

  const note = notes[match[1]];
  const accidental = match[2] === "" ? "" : match[2];
  const octave = octaves[match[3]];

  //return note + accidental + octave;
  return note;
}

function abcToDoremi2(abcNote) {
  const notes = {
    C: "do",
    "C#": "do",
    D: "re",
    "D#": "re",
    Db: "re",
    E: "mi",
    Eb: "mi",
    F: "fa",
    "F#": "fa",
    G: "sol",
    "G#": "sol",
    Gb: "sol",
    A: "la",
    "A#": "la",
    Ab: "la",
    B: "si",
    Bb: "si",
  };

  const octaves = {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
  };

  const abcRegex = /^([A-G])(#{0,2}|b{0,2})(\d)$/;
  const match = abcNote.match(abcRegex);

  const note = notes[match[1]];
  const accidental = match[2] === "" ? "" : match[2];
  const octave = octaves[match[3]];

  //return note + accidental + octave;
  return note;
}

function abcToDoremir(note, dura) {
  note = note.replaceAll("-", "");

  const notes = {
    C: "do",
    "C#": "dó",
    Db: "dó",
    D: "re",
    "D#": "ré",
    Eb: "ré",
    E: "mi",
    F: "fa",
    "F#": "fá",
    Gb: "fá",
    G: "sol",
    "G#": "sól",
    Ab: "sól",
    A: "la",
    "A#": "lá",
    Bb: "lá",
    B: "si",
  };

  const octaves = {
    1: ",,",
    2: ",",
    3: "",
    4: "'",
    5: "''",
    6: "'''",
    7: "''''",
  };

  const letter = note.slice(0, -1);
  const octave = note.slice(-1);
  const doremi = notes[letter];
  const octaveSuffix = octaves[octave];

  return `${doremi}${dura}${octaveSuffix}`;
}

function abcToDoremir2(note) {
  const notes = {
    C: "do",
    "C#": "dó",
    D: "re",
    "D#": "ré",
    E: "mi",
    F: "fa",
    "F#": "fá",
    G: "sol",
    "G#": "sól",
    A: "la",
    "A#": "lá",
    B: "si",
  };

  const octaves = {
    1: ",,",
    2: ",",
    3: "",
    4: "'",
    5: "''",
    6: "'''",
    7: "''''",
  };

  const letter = note.slice(0, -1);
  const octave = note.slice(-1);
  const doremi = notes[letter];
  const octaveSuffix = octaves[octave];

  return `${doremi}${octaveSuffix}`;
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

function finderAll(arr, options) {
  const [findThis, long] = options;
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][findThis] !== undefined) {
      var findi = arr[i][findThis].split(" ");
      if (findi.length == long) {
        result.push(arr[i]);
      }
    }
  }
  return result;
}

function finder4(arr, options) {
  const [findThis, long, returnThis] = options;
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][findThis] !== undefined) {
      var findi = arr[i][findThis].split(" ");
      if (findi.length == long) {
        result.push(arr[i][returnThis]);
      }
    }
  }
  return result;
}

function finder(arr, options) {
  const [divisor, dividen] = options;
  const result = [];
  for (let i = 0; i < arr[divisor].length; i++) {
    if (i % dividen === 0 && arr[divisor][i] !== undefined) {
      result.push(arr[divisor][i]);
    }
  }

  return result;
}

function filtra(arr, n, r) {
  return arr
    .filter((subArr) => subArr.length > n)
    .map((subArr) => {
      if (Array.isArray(subArr[n])) {
        return r !== undefined ? subArr[n][r] : subArr[n];
      } else {
        return subArr[n];
      }
    });
}
function filtra2(arr, n) {
  return arr.filter((subArr) => subArr.length > n).map((subArr) => subArr[n]);
}

function mixArrays(arrays) {
  const result = [];
  const maxLength = Math.max(...arrays.map((arr) => arr.length));

  for (let i = 0; i < maxLength; i++) {
    const subresult = [];

    for (let j = 0; j < arrays.length; j++) {
      const value = arrays[j][i];
      if (value !== undefined) {
        subresult.push(value);
      }
    }

    result.push(subresult);
  }

  return result;
}

function mixArray(A, B) {
  const result = [];

  for (let i = 0; i < A.length && i < B.length; i++) {
    result.push(A[i] + B[i]);
  }

  return result;
}

function proporDurNumber(durations) {
  let propor = [];
  let simbol = [];
  let sum = 0;

  for (let i = 0; i < durations.length; i++) {
    if (mias.hasOwnProperty(durations[i])) {
      propor.push(mias[durations[i]]);
      simbol.push("");
      sum += mias[durations[i]];
    } else {
      simbol.push(durations[i]);
    }
  }

  const duracionMedia = sum / propor.length;
  const proporNorm = duracionMedia / 4;
  let speed = proporNorm * 7 + 1;
  speed = Math.min(Math.max(speed, 1), 8);

  return Math.round(speed);
}

function proporDurNumber4(durations) {
  const ratios = durations.map((dur) => mias[dur]);
  const totalRatio = ratios.reduce((acc, val) => acc + val, 0);
  const meanRatio = totalRatio / ratios.length;
  const meanDuration = 1 / meanRatio;
  const durationInEights = meanDuration / 0.125;
  const result = Math.round(durationInEights);
  return Math.max(1, Math.min(8, result)); // Limitamos el resultado al rango de 1 a 8
}

function proporNumber2(durations) {
  const ratios = durations.map((dur) => mias[dur]);
  const totalRatio = ratios.reduce((acc, val) => acc + val, 0);
  const meanRatio = totalRatio / ratios.length;
  const meanDuration = 1 / meanRatio;
  const durationInEights = meanDuration / 0.125;
  return Math.round(durationInEights);
}

function proporDurations2(durations, notas) {
  const propor = durations.map((dur, i) => {
    if (i === durations.length - 1) return 1;
    const durValue = mias[dur];
    const nextDurValue = mias[durations[i + 1]];
    return nextDurValue / durValue;
  });

  const simbol = [];
  propor.forEach((prop, i) => {
    const nota = notas[i];
    simbol.push(nota);
    if (prop > 2) simbol.push(" ");
    else if (prop > 1) simbol.push("");
  });

  return simbol.join("");
}

function proporDurations(durations) {
  const duraciones = durations.map((d) => mias[d]);
  const duracionTotal = duraciones.reduce((sum, duracion) => sum + duracion);

  const propor = duraciones.map((duracion) => duracion / duracionTotal);

  const simbol = propor.map((p, i) => {
    if (
      p === Math.max(...propor) &&
      Math.max(...propor) !== Math.min(...propor)
    ) {
      return "n";
    } else {
      return "";
    }
  });

  if (new Set(simbol).size === 1 && simbol[0] === "n") {
    return Array(duraciones.length).fill("");
  }

  return simbol;
}

function proporDurations6(durations) {
  // Calcula la duración total de cada símbolo en el array "durations"
  const duraciones = durations.map((d) => mias[d]);
  const duracionTotal = duraciones.reduce((sum, duracion) => sum + duracion);

  // Calcula la proporción de duración de cada símbolo en el array "durations"
  const propor = duraciones.map((duracion) => duracion / duracionTotal);

  // Identifica los elementos que son más grandes proporcionalmente que el resto
  const simbol = propor.map((p, i) => {
    if (p === Math.max(...propor)) {
      return "n";
    } else {
      return "";
    }
  });

  return simbol;
}

function proporDurations4(durations) {
  const propor = durations.map((dur, i) => {
    if (i === durations.length - 1) return 1; // el último elemento siempre tiene una proporción de 1
    const durValue = mias[dur];
    const nextDurValue = mias[durations[i + 1]];
    return nextDurValue / durValue;
  });

  const simbol = propor.map((prop, i) => {
    if (prop > 2) return "m"; // si la proporción es mayor que 2, es muy larga
    if (prop > 1) return "n"; // si la proporción es mayor que 1, es larga
    return ""; // si la proporción es menor o igual que 1, es corta
  });

  return simbol;
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
      '<br><a id="linktext" download="' +
        nameFileTrack +
        '.mid"  href="' +
        escribe.dataUri() +
        '">' +
        nameFileTrack +
        ".mid</a>&nbsp;" +
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
  var nn = 0;
  var contnotes = 0;
  
  contEvent = 1;
  contBeat = 1;
  solre = "";
  cumulNote = "";
  cumulSolr = "";
  cumulAbc = "";
  cumulRhy = "";
  select("#div1-1").html("");
  select("#div2-1").html("");
  select("#div1-2").html("");
  select("#div2-2").html("");
  select("#div1-3").html("");
  select("#div2-3").html("");
  select("#div1-4").html("");
  select("#div2-4").html("");
  select("#divResume").html("");    
  select("#info2").html("");
  resultParts = [];
 
  
 
}


 //var divi = document.getElementById("player15");

 // divi.addEventListener("note", (event) => {
const cumulList=[0,1,2,3,4]
var nextCumul=1

function eventNote(){
    if (contEvent < 2) {
      select("#div1-1").html("");
      select("#div2-1").html("");
      select("#div1-2").html("");
      select("#div2-2").html("");
      select("#div1-3").html("");
      select("#div2-3").html("");
      select("#div1-4").html("");
      select("#div2-4").html("");
      select("#divResume").html("");
      nextCumul=1
      select("#info2").html('')
      resultPart = [];
    }
    /*
    wordSol = resultParts[3][contEvent];
    signi = resultParts[2][contEvent];
    dures = resultParts[0][contEvent];
    if (dures !== undefined) {
      if (dures.length > 1) {
        duresi = dures.split(" ");
      } else {
        duresi = "";
      }
    } else {
      duresi = "";
    }
    */
    //wordSolr = resultParts[4][contEvent];
    //}
   // console.log(JSON.stringify(event));
    var rval =
      (15 / BPM) * (event.detail.note.endTime - event.detail.note.startTime);
    //var ticks = Tone.Ticks(secs,'seconds').toSeconds();
    //console.log("rhyhthm " + rval);
    var duri = searchAprox(rval);
    var piti = event.detail.note.pitch;
    var pite = Tone.Frequency(piti, "midi").toNote();
    var pido = abcToDoremi(pite);
    var pidor = abcToDoremir(pite, "");
    //var pito = abcToDoremir(pite);

    //infot.html(signi +''+wordSol+'')

    cumulAbc += pite + " ";
    cumulNote += pido;
    cumulSolr += pidor;
    cumulRhy += duri + " ";
    var sol1 = searchConcept(cumulNote);
    var cacul = capital(cumulNote);
    //infot.html( contEvent +' '+pito+' '+ wordSol+' '+signi)
    //}

    //select("#div2-1").html(capital(cumulNote))
    
    if (contBeat == 1) {
      //var sol1 = searchConcept(cumulNote);
      if (sol1[0] === undefined) {
        sol1 = [" "];
      }
      //select("#div1-1").html(sol1[0]);
      select("#div2-1").html(cacul);
    }
    if (contBeat == 2) {
      //var sol2 = searchConcept(cumulNote);
      if (sol1[0] === undefined) {
        sol1 = [" "];
      }
      //select("#div1-2").html(sol1[0]);
      select("#div2-2").html(cacul);
    }
    if (contBeat == 3) {
      //var sol3 = searchConcept(cumulNote);
      if (sol1[0] === undefined) {
        sol1 = [" "];
      }
      //select("#div1-3").html(sol1[0]);
      select("#div2-3").html(cacul);
    }
    if (contBeat == 4) {
      //var sol4 = searchConcept(cumulNote);
      if (sol1[0] === undefined) {
        sol1 = [" "];
      }
      //select("#div1-4").html(sol1[0]);
      select("#div2-4").html(cacul);
      //select("#iSolresolSketch").html('')
    }
    
   //cumulConcept+=sol1[0]+' '
  
    select("#divResume").html(
      contEvent +
        "/" +
        contBeat +
        ": " +
        pite +
        " " +
        pido +
        " " +
        cacul +
        " " +
        sol1[0]
    );

   var inpute = {};
    inpute.contEvent = contEvent;
    inpute.contBeat = contBeat;
    inpute.noteAbc = pite;
    inpute.noteDoremi = pido;
    inpute.noteRhy = pidor;
    inpute.cumulAbc = cumulAbc;
    inpute.cumulDoremi = cacul;
    inpute.concept = sol1[0];
    inpute.cumulRhy = cumulRhy;
    inpute.cumulSolr = cumulSolr;
    resultParts.push(inpute)
    var obva = Object.values(inpute);
    var obvi = obva.slice(2, 33);
    var preo =
      inpute.contEvent +
      "/" +
      inpute.contBeat +
      " ";
    select("#info2").html(
      '<div class="divlist">' + preo + " " + obvi.join(", ") + "</div>",
      1
    );
   
    
  
    if (nextCumul == contEvent) {
       cumulConcept+=sol1[0]+' '
        select("#info2").html(
      '<div class="divlist" style="color:#990;">' +cumulConcept + "</div>",
      1
    );
      if (contBeat==1){
        
      select("#div1-1").html(sol1[0]);
      select("#div1-2").html('');
      select("#div1-3").html('');
      select("#div1-4").html('');
      
      select("#div2-2").html('');
      select("#div2-3").html('');
      select("#div2-4").html('');
      }
      if (contBeat==2){
      select("#div1-2").html(sol1[0]);
      }
      if (contBeat==3){
      select("#div1-3").html(sol1[0]);
      }
      if (contBeat==4){
      select("#div1-4").html(sol1[0]);
       cumulConcept=""; 
      }
      
      contBeat += 1;
     if(contBeat>=cumulList.length){contBeat=1; }
    nextCumul += cumulList[contBeat];
      cumulNote = "";
      cumulSolr = "";
      cumulAbc = "";
      cumulRhy = "";
     
    }

    contEvent++;
    if (contEvent > divi.noteSequence.notes.length) {
      contEvent = 1;
      contBeat = 1;
      cumulNote = "";
      cumulSolr = "";
      cumulAbc = "";
      cumulRhy = "";
      cumulConcept=""
     
    
    }
    //if(nn>resultParts.length-1){nn=0;}
    //}
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
