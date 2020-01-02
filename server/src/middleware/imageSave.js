import sharp from "sharp";

export const imageSave = async (req, res, next) => {
    let avatar = req.files.avatar;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      
      const avatarName = req.user._id + Date.now() + ".jpg"
      //avatar.mv("../client/public/images/user_uploads/" + avatar.name);
      sharp(avatar.tempFilePath)
        .resize({ width: 124 })
        .toFile(uploadPath + avatarName)
        .then(function(newFileInfo) {
          //console.log("Success");
        })
        .catch(function(err) {
          console.log(err);
        });
        if(req.user.avatar){
          fs.unlink(uploadPath+req.user.avatar, async function (err) {
            if (err) throw err;
            console.log('File deleted!');
            req.user.avatar = avatarName;
            let user = await req.user.save();
            user = await userPopulateBag(user);
            res.send(user);
          });
        }else{
          req.user.avatar = avatarName;
          let user = await req.user.save();
          user = await userPopulateBag(user);
          res.send(user);
        }
}

export const testMiddleware = async (req, res, next, str) => {
    console.log(str)
    next()
}