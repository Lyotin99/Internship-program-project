const functions = require('firebase-functions');
const express=require('express');
const app=express();
const admin=require('firebase-admin');
admin.initializeApp();
const { body, validationResult } = require('express-validator');

//show teams
app.get("/",async (req,res)=>{
  const snapshot=await admin.firestore().collection("teams").get();
  let team=[];
  snapshot.forEach((doc)=>{
      let id=doc.id;
      let data=doc.data();
      team.push({id,...data});
  })
 
  res.status(200).send(JSON.stringify(team));
})
//show interns
app.get("/interns", async (req,res)=>{
  const snapshot=await admin.firestore().collection("interns").get();
  let interns=[];
  snapshot.forEach((doc)=>{
      let id=doc.id;
      let data=doc.data();
      interns.push({id,...data});
  })
  res.status(200).send(JSON.stringify(interns));
})

//show team by id
app.get("/:id",async (req,res)=>{
  const snapshot=await admin.firestore().collection("teams").doc(req.params.id).get();

  const teamId=snapshot.id;
  const teamData=snapshot.data();
  res.send(JSON.stringify({id:teamId,...teamData}));
})

//show intern by id
app.get("/interns/:id",async (req,res)=>{
  const snapshot=await admin.firestore().collection("interns").doc(req.params.id).get();

  const internId=snapshot.id;
  const internData=snapshot.data();
  res.send(JSON.stringify({id:internId,...internData}));
})

app.get("/:id/interns",async (req,res)=>{
const teamSnapshot= await admin.firestore().collection("teams").doc(req.params.id).get();
const internSnapshot= await admin.firestore().collection("interns").get();
const teamId=teamSnapshot.id;
let intern=[];
internSnapshot.forEach((doc)=>{
let internId=doc.data().teamId;
if(teamId.toString()===internId.toString())
{
  let id=doc.id;
  let tID=doc.data();
intern.push({id,...tID})
}

})
res.send(intern);
})

//create team
const validateTeams=[
  body('name').notEmpty().withMessage("Name is required")
];
app.post("/", validateTeams,async(req,res)=>{
const error=validationResult(req);
if(!error.isEmpty())
{
  return res.status(400).json({errors:error.array()})
}
const team=req.body;
await admin.firestore().collection("teams").add(team);
res.status(201).send();

})
//create intern

const validateInterns=[
  body('firstName').notEmpty().withMessage("First name is required"),
  body('lastName').notEmpty().withMessage("Last name is required"),
  body('university').notEmpty().withMessage("University is required"),
  body('teamId').optional()
]

app.post("/interns",validateInterns,async (req,res)=>
{
  const error=validationResult(req);
  if(!error.isEmpty())
  {
    return res.status(400).json({errors:error.array()})
  }

const intern=req.body;
await admin.firestore().collection("interns").add(intern)
res.send(intern);
})


//update team
app.put("/:id", async (req,res)=>{
  const body=req.body;
  await admin.firestore().collection("teams").doc(req.params.id).update(body);

  res.send(body);
})

//update intern
app.put("/interns/:id", async (req,res)=>{
  const body=req.body;
  await admin.firestore().collection("interns").doc(req.params.id).update(body);

  res.send(body);
})


//delete team

app.delete("/:id",async (req,res)=>{
await admin.firestore().collection("teams").doc(req.params.id).delete();

res.send("team deleted successfully");

})

//delete intern
app.delete("/interns/:id",async (req,res)=>{
  await admin.firestore().collection("interns").doc(req.params.id).delete();
  
  res.send("Intern deleted successfully");
  
  })

 



exports.teams=functions.https.onRequest(app);
// const port=process.env.PORT || 3000;
// app.listen(port,()=>console.log(`Listenning on port ${port}...`))
