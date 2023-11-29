import connectMongo from "@/libs/mongodb";
import Post from "@/models/post";

export default async function postAPI(req: any, res: any) {
  try {
    console.log('connecting to mongodb');
    await connectMongo();
    console.log('connected to mongodb');

    if(req.method === 'POST'){
      console.log('creating documents');
      const createdPost = await Post.create(req.body);
      console.log('created documents');
      res.json({createdPost});
    } else if (req.method === 'GET') {
      console.log('fetching documents');
      const fetchedPost = await Post.find({});
      console.log('fetched documents');
      res.json({fetchedPost});
    }
  } catch(error) {
    console.log('error:', error);
    res.json({error})
  }
}