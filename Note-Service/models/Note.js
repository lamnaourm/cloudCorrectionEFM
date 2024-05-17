import {Schema, model} from "mongoose";

const NoteSchema = new Schema({
    cef:{type:String, required:true, unique:true},
    nom_module:String,
    date_ajout:Date,
    note:Number
})

export default model('note',NoteSchema)

