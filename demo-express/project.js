const Joi=require('joi');
const express=require('express');

const app=express();

app.use(express.json());
const teams=[
    {id:1,name:"Indus"},
    {id:2,name:"White"},
    {id:3,name:"Black"},
];

const interns=[
    {id:1,firstName:"Ivan",lastName:"Ivanov",university:"UE-Varna",teamId:1},
    {id:2,firstName:"Petar",lastName:"SLavov",university:"UE-Varna",teamId:3},
    {id:3,firstName:"Svetoslav",lastName:"Uzunov",university:"UE-Varna",teamId:1}
];



//beggining of teams
app.get(('/teams'),(req,res)=>{
    res.send(teams);
});

app.get('/teams/interns',(req,res)=>{

    res.send(interns);
})

app.get(('/teams/:id'),(req,res)=>{
    const team= teams.find(c=>c.id===parseInt(req.params.id))
    if(!team)
    {
        res.status(404).send("The team with the given ID was not found");
 
    }else res.send(team )
 });



app.post('/teams',(req,res)=>{
    const {error}=validateTeam(req.body);//result.error
    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }
  

const team={
id:teams.length+1,
name:req.body.name,
};
 
teams.push(team);
res.send(team);

})
app.put('/teams/:id',(req,res)=>{
//Look up the course
//if not existing,return 404
const team= teams.find(c=>c.id===parseInt(req.params.id))
   if(!team)
   {
       res.status(404).send("The team with the given ID was not found");
       return;
   }

//Validate
//if invalid,return 400-Bad request
//const result=validateTeam(req.body);
const {error}=validateTeam(req.body);//result.error
if(error){
    res.status(400).send(error.details[0].message)
    return;
}

team.name=req.body.name;
res.send(team);


})

app.delete('/teams/:id',(req,res)=>
{
    const team=teams.find(c=>c.id===parseInt(req.params.id));
    if(!team){
          res.status(404).send("The team with the given ID not found");
          return;
         
    }

    const index=teams.indexOf(team);
    teams.splice(index,1);

    res.send(team);



})

//end of teams

//beggining of interns section

// app.get(('/teams/:id-team/interns/:id'),(req,res)=>{
//     const intern= interns.find(c=>c.id===parseInt(req.params.id));
//    if(!intern)
//    {
//        res.status(404).send("The intern with the given ID was not found");

//    }
    
   
//        res.send(intern)
   
// });


app.get('/teams/:id/interns',(req,res)=>{
    
   let a=[];
   let counter=0;
   const team=req.params.id;
   
    for(let intern=0;intern<interns.length;intern++)
    {
    
       if(parseInt(team)===interns[intern].teamId)
       {
           a[counter]=interns[intern];
           counter++;
       }
    }
    if(a.length>0)
       res.send(a)
       else res.send("No Interns in this team")
    
});

app.get('/teams/interns/:id',(req,res)=>{
    const intern=interns.find(c=>c.id===parseInt(req.params.id))
    if(!intern)
    {
        res.status(404).send("The intern with the given ID was not found")
        return;
    }
    res.send(intern);
})

app.post('/teams/interns',(req,res)=>
{
    const result=validateIntern(req.body);  
    const team_id=validateTeamID(req.body.teamId);
if(result.error)
{
    res.status(400).send(result.error.details[0].message);
    return;
}
if(!team_id)
{
    res.status(400).send("No team with that ID.Check if you have 'teamId' in input")
    return;
}

const intern={
id:interns.length+1,
firstName:req.body.firstName,
lastName:req.body.lastName,
university:req.body.university,
teamId:req.body.teamId
}

interns.push(intern);
res.send(intern);
})

app.post('/teams/:id/interns',(req,res)=>
{
    const result=validateIntern(req.body);  
if(result.error)
{
    res.status(400).send(result.error.details[0].message);
    return;
}

const team_id=parseInt(req.params.id);
const validateID=validateTeamID(team_id);

if(!validateID)
{
    res.status(400).send("No team with that ID")
    return;
}

const intern={
id:interns.length+1,
firstName:req.body.firstName,
lastName:req.body.lastName,
university:req.body.university,
teamId:team_id
}

interns.push(intern);
res.send(intern);
})

app.put('/teams/interns/:id',(req,res)=>{
const intern=interns.find(c=>c.id===parseInt(req.params.id));

if(!intern)
{
    res.status(404).send("The intern with the given ID was not found");
       return;
}

const result=validateIntern(req.body);
if(result.error)
{
    res.status(400).send(result.error.details[0].message);
}

const team_id=validateTeamID(req.body.teamId)
if(!team_id)
{
    res.status(400).send("No team with that ID.Check if you have 'teamId' in input")
    return;
}


intern.firstName=req.body.firstName;
intern.lastName=req.body.lastName;
intern.university=req.body.university;
intern.teamId=req.body.teamId

res.send(intern);
})
//end of interns section
app.delete('/teams/interns/:id',(req,res)=>{
    const intern=interns.find(c=>c.id===parseInt(req.params.id));

if(!intern)
{
    res.status(404).send("The intern with the given ID was not found");
       return;
}
// console.log(intern)
// const index=interns.indexOf(intern);
console.log(intern.length)
intern.id=null;
intern.firstName=null;
intern.lastName=null;
intern.university=null;
intern.teamId=null;

 res.send(intern);
})



function validateTeam(team){
    const schema=Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(team);
}

function validateIntern(intern){
    
    const schema=Joi.object({
        firstName: Joi.string().min(1).required(),
        lastName: Joi.string().min(1).required(),
        university: Joi.string().min(1).required(),
        teamId:Joi.number()

    });
    return schema.validate(intern);
}


function validateTeamID(id)
{
    
    for(let i=0;i<teams.length;i++)
    {
        if(parseInt(teams[i].id)===parseInt(id))
        {
            return true;
        }
    }
    return false;
}
const port=process.env.PORT || 3000;
app.listen(port,()=>console.log(`Listenning on port ${port}...`))



