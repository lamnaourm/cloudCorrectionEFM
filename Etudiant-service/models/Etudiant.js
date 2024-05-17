import {Schema, model} from "mongoose";

const EtudiantSchema = new Schema({
    cef:{type:String, required:true, unique:true},
    nom:{type:String, required:true, minlength:4},
    age:Number,
    password:String
})

export default model('etudiant',EtudiantSchema)

