import  {MongoClient} from 'mongodb'
import { NextResponse } from 'next/server';


export async function POST(request){
    
    let {action,slug,initialQuanitity} = await request.json();
    const uri = "mongodb+srv://hardik:buh8AtI0PX94K7g8@cluster.iznlmik.mongodb.net/"
    const client = new MongoClient(uri);
      try{
        const database = client.db('stock');
        const inventory = database.collection("inventory");
        const filter = {slug:slug};
        let newQuanity = action=="plus"?(parseInt(initialQuanitity+1)):(parseInt(initialQuanitity-1));
        const updateDoc = {
            $set:{
                quantity: newQuanity
            },
        };
        const result = await inventory.updateOne(filter,updateDoc,{});
        return NextResponse.json({sucess:true,message:"yes done"})
    }finally{
        await client.close();
    }
}
        