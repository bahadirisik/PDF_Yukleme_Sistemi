const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Login = require("./models/Login");
const Pdf = require("./models/Pdf");
const content = require("./models/Content");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const PDFDocument = require("pdf-lib").PDFDocument;
const pdf = require("pdf-parse");

const app = express();
let user, pas, id;
let login;

mongoose.connect("mongodb://localhost/proje3-test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

dizi = [0, 1, 3, 9];
let dizi1 = [];
async function pdf_parser(name,pdfin_id) {
  let dataBuffer = fs.readFileSync("./" + name);

  pdf(dataBuffer)
    .then(async function (data) {
      let dizi2 = data.text;
      dizi1 = dizi2.split("\n");
      dizi1 = dizi1.filter(function (str) {
        return /\S/.test(str);
      });
      for (let i = 0; i < dizi1.length; i++) {
        dizi1[i] = dizi1[i].trim();
      }
      console.log(dizi1);
      let index = dizi1.indexOf("BİLGİSAYAR MÜHENDİSLİĞİ BÖLÜMÜ");
      console.log(index);
      let index1 = dizi1.indexOf("KOCAELİ ÜNİVERSİTESİ", 3);
      console.log(index1);
      let ders_adi = dizi1[index + 1];
      let baslik_adi = dizi1[index + 2];
      
      let isim = [];
      for (let i = index + 3; i < index1 - 1; i++) {
        isim.push(dizi1[i]);
      }
      console.log(isim);
      index=dizi1.indexOf("BİLGİSAYAR MÜHENDİSLİĞİ BÖLÜMÜ",3)
      index1=dizi1.indexOf(baslik_adi,5)

      for (let i=index+1;i<index1;i++)
      {
        ders_adi=dizi1[i]
      }
      
      console.log(index,index1)
      
      index = dizi1.lastIndexOf(isim[isim.length - 1]);
      console.log(index);
      index1 = dizi1.lastIndexOf(
        "................................................"
      );
      console.log(index1);
      let juri = [];
      let a = 0;
      for (let i = index + 1; i < index1; i++) {
        if (a % 3 == 0) {
          console.log(dizi1[i]);
          juri.push(dizi1[i]);
        }
        a++;
      }
      let tarih1 = dizi1[index1 + 1].slice(25, 35);
      console.log(tarih1);

      index = dizi1.lastIndexOf(
        "İmza:........................................."
      );
      console.log(index);
      a = 0;
      let numara1 = [];
      for (let i = index1+6; i < index; i++) {
        if (a % 3 == 0) {
          console.log(dizi1[i].slice(11, 20));
          numara1.push(dizi1[i].slice(11, 20));
        }
        a++;
      }
      console.log(numara1)
      index = dizi1.lastIndexOf("ÖZET");
      console.log(index);

      for (let i = index; i < dizi1.length; i++) {
        if (dizi1[i].indexOf("Anahtar  kelimeler") < 0) {
          continue;
        } else {
          a = i;
        }
      }
      let ozet1 = "";
      console.log(a);
      for (let i = index + 1; i < a; i++) {
        ozet1 = ozet1 + " " + dizi1[i];
      }
      console.log(ozet1);
      let anahtar_kelimeler = "";
      for (let i = a; i < dizi1.length; i++) {
        anahtar_kelimeler = anahtar_kelimeler + " " + dizi1[i];
      }
      console.log(anahtar_kelimeler);
      anahtar_kelimeler = anahtar_kelimeler.slice(
        20,
        anahtar_kelimeler.length - 1
      );
      console.log(anahtar_kelimeler);
      let anahtar = anahtar_kelimeler.split(",");
      console.log(anahtar);
        
      for (let i = 0 ;i<isim.length;i++)
      {
        console.log("isim")
          isim[i]=isim[i].toLocaleLowerCase('tr-TR');
      }
      for (let i = 0 ;i<numara1.length;i++)
      {
        console.log("numra")
        numara1[i]=numara1[i].toLocaleLowerCase('tr-TR');
      }
      ders_adi=ders_adi.toLocaleLowerCase('tr-TR');
      console.log("ders_adi")
      console.log(Number(tarih1.slice(3,5)))
      if(Number(tarih1.slice(3,5))>=2 && Number(tarih1.slice(3,5))<=7)
      {
        console.log("tar")
        tarih1="bahar"+" "+tarih1.slice(6,10)
      }
      else{
        console.log("tar")
        tarih1="güz"+" "+tarih1.slice(6,10)
      }
      ozet1=ozet1.toLocaleLowerCase('tr-TR')
      baslik_adi=baslik_adi.toLocaleLowerCase('tr-TR')
      for (let i = 0 ;i<anahtar.length;i++)
      {
        console.log("ana")
        anahtar[i]=anahtar[i].toLocaleLowerCase('tr-TR')
        anahtar[i]=anahtar[i].trim()
      }
      console.log("adsasdadasdas")
      await content.create({
        pdf_id:pdfin_id,
        ad: isim,
        numara: numara1,
        juriler: juri,
        dersadi: ders_adi,
        tarih: tarih1,
        ozet: ozet1,
        baslik: baslik_adi,
        anahtarKelimeler: anahtar,
      });
      console.log("adsasdadasdas")
    })
    .catch(function (error) {
      // handle exceptions
    });
}

async function splitPdf(pathToPdf, pdfname) {
  const docmentAsBytes = await fs.promises.readFile(pathToPdf);

  // Load your PDFDocument
  const pdfDoc = await PDFDocument.load(docmentAsBytes);

  const numberOfPages = pdfDoc.getPages().length;
  const subDocument = await PDFDocument.create();
  for (let i = 0; i < dizi.length; i++) {
    console.log(dizi[i]);
    const [copiedPage] = await subDocument.copyPages(pdfDoc, [dizi[i]]);
    subDocument.addPage(copiedPage);
  }
  const pdfBytes = await subDocument.save();
  await writePdfBytesToFile(pdfname, pdfBytes);
}

async function writePdfBytesToFile(fileName, pdfBytes) {
  return fs.promises.writeFile(fileName, pdfBytes);
}

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.get("/", function (req, res) {
  res.render("login");
});

app.get("/ragister", function (req, res) {
  res.render("ragister");
});

app.get("/a/id", function (req, res) {
  console.log(pas, user);

  res.render("a");
});

app.get("/home/:id",async function(req,res){
    console.log(req.params.id)
    let icerik= await content.findOne({pdf_id:req.params.id})
    console.log(icerik)
    res.render("content",{
      icerik,
    })

});


app.get("/add_post", async function (req, res) {
  res.render("add_post");
});

app.get("/home", async function (req, res) {
  if(login.authority=="admin")
  {
    let pdfs = await Pdf.find({});
    res.render("admin",{
      pdfs
    })
    
  }
  else
  {
    let data = await Pdf.find({ id: login._id });
  console.log(data);
  res.render("home", {
    login,
    data,
  });
  }
  
});
app.get("/data", async function (req, res) {
  let data1 = await Pdf.find({ id: login._id });

  res.render("data", {
    data1,
  });
});
app.get("/arama",async function(req,res){
  res.render("arama")
})
app.get("/")
app.post("/user_ragister", async function (req, res) {
  
  await Login.create({username:req.body.username,password:req.body.password,authority:"user"});
  res.redirect("/home");
});

app.post("/search" ,async function(req,res){

  let idler=[]
  console.log(req.body.fav_language)
  let temp=req.body
  console.log(temp.length)
  if(req.body.fav_language!=undefined)
  {
    console.log("ife girdim")
    if(req.body.fav_language=="yazar")
  {
   console.log(req.body.search)
    let data_search = await content.find({})
    console.log(data_search.length)
    console.log(data_search[3].ad)
    for(let i=0;i<data_search.length;i++)
    {
      for(let j =0 ;j<data_search[i].ad.length;j++)
      {
        console.log(data_search[i].ad[j][3])
        console.log(req.body.search.length)        
          if(data_search[i].ad[j]==req.body.search)
          {
            idler.push(data_search[i].pdf_id)
            console.log(data_search[i].pdf_id)
          }
          
      }
    }
    console.log(idler)
    res.render("search",{
      idler,
    })
  }
  else if (req.body.fav_language=="ders")
  {
    let data_search = await content.find({dersadi:req.body.search})
    let idler=[]
    console.log(data_search)
    for(let i =0 ;i<data_search.length;i++)
    {
      idler.push(data_search[i].pdf_id)
    }
    res.render("search",{
      idler,
    })
  }
  else if (req.body.fav_language=="proje_adi")
  {
    let data_search = await content.find({baslik:req.body.search})
    let idler=[]
    console.log(data_search)
    for(let i =0 ;i<data_search.length;i++)
    {
      idler.push(data_search[i].pdf_id)
    }
    res.render("search",{
      idler,
    })
  }
  else if (req.body.fav_language=="anahtar_kelimeler")
  {
    console.log(req.body.search)
    let data_search = await content.find({})
    console.log(data_search.length)
    console.log(data_search[0].anahtarKelimeler)
    for(let i=0;i<data_search.length;i++)
    {
      for(let j =0 ;j<data_search[i].anahtarKelimeler.length;j++)
      {
        console.log(data_search[i].anahtarKelimeler[j])
        console.log(req.body.search.length)        
          if(data_search[i].anahtarKelimeler[j]==req.body.search)
          {
            idler.push(data_search[i].pdf_id)
            console.log(data_search[i].pdf_id)
          }
          
      }
    }
    console.log(idler)
    res.render("search",{
      idler,
    })
  }
  else if (req.body.fav_language=="donem")
  {
    let data_search = await content.find({tarih:req.body.search})
    let idler=[]
    console.log(data_search)
    for(let i =0 ;i<data_search.length;i++)
    {
      idler.push(data_search[i].pdf_id)
    }
    res.render("search",{
      idler,
    })
  }
  }

  else{
    console.log("else girdim")
    let array=req.body.search.split(" ")
    console.log(array)
    let tarih2 = array[0]+" "+array[1]
    let dersadi2=array[array.length-2]+" "+array[array.length-1]
    let adi="";
    for(let i=2;i<array.length-2;i++)
    {
      adi=adi+array[i]+" "
    }
    adi=adi.trim()
    adi=adi.toLocaleLowerCase('tr-TR');
    tarih2=tarih2.toLocaleLowerCase('tr-TR');
    dersadi2=dersadi2.toLocaleLowerCase('tr-TR');
    console.log(tarih2,dersadi2,adi)
    let id1=await Login.findOne({username:adi})
    console.log(id1._id)
    let data_search = await Pdf.find({id:id1._id})
    console.log(data_search)
    for(let i=0;i<data_search.length;i++)
    {
      let pdfbul=await content.findOne({pdf_id:data_search[i]._id})
      if(pdfbul.tarih==tarih2&&pdfbul.dersadi==dersadi2)
      {
        console.log(pdfbul._id)
        idler.push(pdfbul.pdf_id)
      }
    }
    res.render("search",{
      idler,
    })
    /*let data_search = await content.find({})
    console.log(data_search.length)
    console.log(data_search[3].ad)
    for(let i=0;i<data_search.length;i++)
    {
      for(let j =0 ;j<data_search[i].ad.length;j++)
      {      
          if(data_search[i].ad[j]==adi&&data_search[i].tarih==tarih2&&data_search[i].dersadi==dersadi2)
          {
            idler.push(data_search[i].pdf_id)
          } 
      }
    }
    res.render("search",{
      idler,
    })*/
  }
  

})
app.get("/islemler",async function(req,res){
  let log=await Login.find({authority:"user"})
  res.render("islemler",{
    log,
  })
})
app.get("/update/:id",async function(req,res){
  idd=req.params.id
  res.render("update",{idd})

})
app.get('/delete/:id', async (req, res) => {
  
  await Login.findByIdAndRemove(req.params.id);
  res.redirect('/islemler');
});

app.post("/updateall/:id", async function (req, res) {
  console.log(req.params.id)
  const logi = await Login.findOne({ _id: req.params.id });
  logi.username=req.body.username
  logi.password=req.body.password
  logi.save()
  res.redirect("/islemler")
});

app.post("/home", async function (req, res) {
  login = await Login.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  
  if(login==null)
  {
   res.redirect("/")
  }
  else{
    if(login.authority=="admin")
    {
      let pdfs=await Pdf.find()

      res.render("admin",{
        pdfs,
      })
    }
    else{
      res.render("home", {
    login,
  });
    }
    
  }
  
});

app.post("/pdf", async (req, res) => {
  const uploaddir = "public/pdf";

  if (!fs.existsSync(uploaddir)) {
    fs.mkdirSync(uploaddir);
  }
  console.log(req.files);
  let uploutedpdf = req.files.pdf;
  let uploadPath = __dirname + "/public/pdf/" + uploutedpdf.name;
  let temp;
  uploutedpdf.mv(uploadPath, async () => {
   temp= await Pdf.create({
      id: login._id,
      pdf: "/pdf/" + uploutedpdf.name,
    });
    await splitPdf(
      "public/pdf/" + uploutedpdf.name,
      "Final" + uploutedpdf.name,
      
    );
    pdf_parser("./Final" + uploutedpdf.name,temp._id);
    res.redirect("home");
  });
});

app.listen(3000, () => {
  console.log("Port 3000 de server oluşturludu");
});
