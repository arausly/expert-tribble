import mongoose from "mongoose";
import Password from "../services/password";

interface UserAttributes {
  email: string;
  password: string;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttributes): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    //covers both newly created of modified password
    const hashPassword = await Password.toHash(this.get("password"));
    this.set("password", hashPassword);
    next();
  }
});

userSchema.statics.build = (attrs: UserAttributes) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
