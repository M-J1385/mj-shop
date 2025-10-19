const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const sqllite = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bycript = require("bcryptjs");
const cookieparser = require("cookie-parser");
const port = 4500;
const Secret_Key = "6572d572a21ea1277d8936639ee5d5bce6deb6ab22dc";
app.use(
  cors({
    origin: "http://localhost:8080", // آدرس Vue
    credentials: true, // اجازه ارسال کوکی
  })
);
app.use(cookieparser());
app.use(express.json());

const db = new sqllite.Database("data.db");

db.run(`CREATE TABLE IF NOT EXISTS products(
    autoid INTEGER PRIMARY KEY AUTOINCREMENT,
    id INTEGER,
    title TEXT,
    image TEXT,
    price INTEGER,
    oldprice INTEGER,
    category TEXT,
    proqty INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accessid INTEGER,
    username TEXT,
    password TEXT,
    email TEXT,
    useradmin INTEGER,
    selected_address INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    address TEXT,
    vahed TEXT,
    pelak TEXT,
    address_number INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(accessid) ON DELETE CASCADE
)`);

db.run(`CREATE TABLE IF NOT EXISTS shopcart(
      id INTEGER PRIMARY KEY,
      title TEXT,
      image TEXT,
      price INTEGER,
      oldprice INTEGER,
      category TEXT,
      proqty INTEGER,
      count INTEGER,
      username TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS categories(
  persiancat TEXT PRIMARY KEY,
  englishcat TEXT,
  catimage TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS skills(
    skillname TEXT,
    skillvalue TEXT,
    proid INTEGER,
    FOREIGN KEY (proid) REFERENCES products(id) ON DELETE CASCADE
)`);

const uploadDir = path.join("D:/Tamrin/Vue/vue-cli/mj-shop/public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const fileFilter = (req, file, cb) => {
  const filepath = path.join(uploadDir, file.originalname);
  if (fs.existsSync(filepath)) {
    req.existimage = true;
    req.existfilename = file.originalname;
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage, fileFilter });

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token)
//     return res
//       .status(401)
//       .json({ status: "error", message: "توکن وجود ندارد" });

//   jwt.verify(token, Secret_Key, (err, user) => {
//     if (err)
//       return res
//         .status(403)
//         .json({ status: "error", message: "توکن نامعتبر است" });
//     req.user = user;
//     next();
//   });
// }

app.post("/addtocat", upload.single("catimage"), (req, res) => {
  const { persiancat, englishcat } = req.body;
  let image;
  if (req.existimage) {
    image = req.existfilename;
  } else {
    image = req.file ? req.file.originalname : null;
  }
  db.run(
    `INSERT INTO categories (persiancat,englishcat,catimage) VALUES (?,?,?)`,
    [persiancat, englishcat, image],
    function (err) {
      if (err) {
        return res.status(500).json({ status: "error", message: err });
      }
      res.json({ status: "success", message: "ثبت شد" });
    }
  );
});

app.get("/getcategory", (req, res) => {
  db.all(`SELECT * FROM categories`, (err, rows) => {
    if (err) {
      res.status(500).json({ status: "error", message: err });
    }
    res.json(rows);
  });
});

app.post("/deletecategory", (req, res) => {
  const { cat } = req.body;
  db.run("DELETE FROM categories WHERE persiancat=?", [cat], function (err) {
    if (err) {
      res.status(500).json({ status: "error", message: err });
    }
    res.json({ status: "success", message: "حذف انجام شد" });
  });
});

app.post("/save", (req, res) => {
  const { accessid, username, password, email } = req.body;
  const hashedpassword = bycript.hashSync(password, 10);
  db.run(
    `INSERT INTO users (accessid,username,password,email,useradmin,selected_address) VALUES (?,?,?,?,?,?)`,
    [accessid, username, hashedpassword, email, 0, 1],
    function (err) {
      if (err) {
        res.status(500).json({ status: "error", message: "اطلاعات ذخیره نشد" });
      }
      res.json({ status: "success", message: "اطلاعات ذخیره شد" });
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username=?`,
    [username],
    function (err, users) {
      if (err) {
        res.status(500).json({ status: "error", message: "خطا", err });
      } else {
        if (!users) {
          res.json({ status: "error", message: "کاربر پیدا نشد" });
        } else {
          const ispasswordvalid = bycript.compareSync(password, users.password);

          if (!ispasswordvalid) {
            res.json({ status: "error", message: "گذرواژه اشتباه است" });
          } else {
            const token = jwt.sign(
              {
                id: users.id,
                accessid: users.accessid,
                username: users.username,
                password: users.password,
                email: users.email,
                useradmin: users.useradmin,
              },
              Secret_Key,
              { expiresIn: "7d" }
            );

            res.cookie("token", token, {
              httpOnly: true,
              secure: false,
              sameSite: "strict",
            });

            res.json({ status: "success", token });
          }
        }
      }
    }
  );
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.json({ status: "success", message: "خارج شدی" });
});

app.get("/checklogin", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.json({ status: "error", message: "لاگین نکرده‌ای" });
  } else {
    try {
      const decoded = jwt.verify(token, Secret_Key);
      db.all(
        `SELECT *
        FROM users u
        LEFT JOIN addresses a ON u.accessid = a.user_id
        WHERE u.accessid = ?`,
        [decoded.accessid],
        (err, rows) => {
          if (err || !rows) {
            return res
              .status(500)
              .json({ status: "error", message: "خطا در سرور" });
          } else {
            const user = {
              accessid: rows[0].accessid,
              username: rows[0].username,
              password: rows[0].password,
              email: rows[0].email,
              useradmin: rows[0].useradmin,
              address: [],
              selected_address: {},
            };
            rows.forEach((item) => {
              user.address.push({
                address_number: item.address_number,
                pelak: item.pelak,
                vahed: item.vahed,
                address: item.address,
              });
            });
            user.selected_address.selected = user.address.find(
              (p) => p.address_number == rows[0].selected_address
            )?.address;
            user.selected_address.number = rows[0].selected_address;
            res.json({ status: "success", user, rows });
          }
        }
      );
    } catch {
      res.status(401).json({ status: "error", message: "توکن نامعتبر" });
    }
  }
});

app.post("/updateaddress", (req, res) => {
  const { addnumber, id } = req.body;
  db.run(
    "UPDATE users SET selected_address=? WHERE accessid=?",
    [addnumber, id],
    function (err) {
      if (err) {
        res.status(500).json({ status: "error", message: err });
      }
      res.json({ status: "success", message: "انجام شد" });
    }
  );
});

app.post("/addaddress", (req, res) => {
  const { id, address, vahed, pelak } = req.body;
  db.all(`SELECT * FROM addresses WHERE user_id=?`, [id], function (err, rows) {
    if (err) {
      res.status(500).json({ status: "error", message: "خطا در سرور" });
    } else {
      if (!rows) {
        db.run(
          "INSERT INTO addresses (user_id,address,vahed,pelak,address_number) VALUES (?,?,?,?,?)",
          [id, address, vahed, pelak, 1],
          function (err) {
            if (err) {
              res
                .status(500)
                .json({ status: "error", message: "خطا در سرور 1" });
            }
            res.json({ status: "success", message: "آدرس ثبت شد" });
          }
        );
      } else {
        db.run(
          "INSERT INTO addresses (user_id,address,vahed,pelak,address_number) VALUES (?,?,?,?,?)",
          [id, address, vahed, pelak, rows.length + 1],
          function (err) {
            if (err) {
              res.status(500).json({ status: "error", message: err });
            }
            res.json({ status: "success", message: "آدرس ثبت شد" });
          }
        );
      }
    }
  });
});

app.get("/getsimilarpro", (req, res) => {
  const cat = req.query.cat;
  const id = req.query.id;
  db.all(
    `SELECT * FROM products WHERE category=? AND id!=?`,
    [cat, id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ status: "error", message: err });
      }
      res.json(rows);
    }
  );
});

app.get("/getshopcart", (req, res) => {
  const username = req.query.username;
  db.all(
    `SELECT * FROM shopcart WHERE username = ?`,
    [username],
    (err, rows) => {
      if (err) {
        res.status(500).json({ status: "error", message: err });
      }
      res.json(rows);
    }
  );
});

app.post("/addtoshopcart", (req, res) => {
  const {
    id,
    title,
    image,
    price,
    oldprice,
    category,
    proqty,
    count,
    username,
  } = req.body;
  db.run(
    `INSERT INTO shopcart (id,title,image,price,oldprice,category,proqty,count,username) VALUES (?,?,?,?,?,?,?,?,?)`,
    [id, title, image, price, oldprice, category, proqty, count, username],
    function (err) {
      if (err) {
        res.status(500).json({ status: "error", message: err });
      }
      res.json({ status: "success", message: "اطلاعات ثبت شد" });
    }
  );
});

app.post("/deleteshopitem", (req, res) => {
  const { id } = req.body;
  db.get("SELECT count FROM shopcart WHERE id=?", [id], (err, rows) => {
    if (err) {
      res.status(500).json({ status: "error", message: err });
    }
    db.run(`DELETE FROM shopcart WHERE id=?`, [id], function (err) {
      if (err) {
        res.status(500).json({ status: "error", message: err });
      }
      db.get("SELECT proqty FROM products WHERE id=?", [id], (err, rows1) => {
        if (err) {
          res.status(500).json({ status: "error", message: err });
        }
        var sumqty = rows.count + rows1.proqty;
        db.run(
          "UPDATE products SET proqty=? WHERE id=?",
          [sumqty, id],
          function (err) {
            if (err) {
              res.status(500).json({ status: "error", message: err });
            }
            res.json({ status: "success", message: "با موفقیت حذف شد" });
          }
        );
      });
    });
  });
});

app.get("/getproducts", (req, res) => {
  db.all(`SELECT * FROM products`, (err, rows) => {
    if (err) {
      res.status(500).json({ status: "error", message: err });
    }
    res.json(rows);
  });
});

app.post("/updateqty", (req, res) => {
  const { id, count } = req.body;
  db.get(`SELECT proqty FROM shopcart WHERE id=?`, [id], (err, rows) => {
    if (err) {
      res.status(500).json({ status: "error", message: err });
    }
    if (!rows) {
      res.status(404).json({ status: "error", message: "محصول یافت نشد" });
    }
    if (rows.proqty < count) {
      res.status(400).json({ status: "error", message: "موجودی کافی نیست" });
    }

    const newqty = rows.proqty - count;

    db.run(
      `UPDATE products SET proqty=? WHERE id=?`,
      [newqty, id],
      function (err) {
        if (err) {
          res.status(500).json({ status: "error", message: err });
        }
        res.json({ status: "success", message: "اپدیت انجام شد", newqty });
      }
    );
  });
});

app.post("/updateshopcount", (req, res) => {
  const { id, count } = req.body;
  db.run(`UPDATE shopcart SET count=? WHERE id=?`, [count, id], function (err) {
    if (err) {
      res.status(500).json({ status: "error", message: err });
    }
    res.json({ status: "success", message: "اپدیت انجام شد" });
  });
});

app.get("/getskills", (req, res) => {
  const proid = req.query.proid;
  db.all("SELECT * FROM skills WHERE proid=?", [proid], (err, rows) => {
    if (err) {
      res.status(500).json({ status: "error", message: err });
    }
    res.json(rows);
  });
});

app.post("/addtoskills", upload.single("image"), (req, res) => {
  let { skills, id } = req.body;
  skills = JSON.parse(skills);

  let errorOccurred = false;
  let completed = 0;

  skills.forEach((item) => {
    db.run(
      `INSERT INTO skills (skillname,skillvalue,proid) VALUES (?,?,?)`,
      [item.skillname, item.skillvalue, id],
      function (err) {
        if (err) {
          errorOccurred = true;
          console.error("خطا در درج skill:", err.message);
        }
        completed++;

        if (completed === skills.length) {
          if (errorOccurred) {
            return res
              .status(500)
              .json({ status: "error", message: "خطا در ثبت اطلاعات" });
          } else {
            return res.json({
              status: "success",
              message: "مهارت‌ها ثبت شدند",
            });
          }
        }
      }
    );
  });
});

app.post("/updateproduct", upload.single("image"), (req, res) => {
  const { id, title, price, oldprice, category, proqty } = req.body;
  var { skills } = req.body;
  const image = req.file ? req.file.originalname : req.body.image;
  skills = JSON.parse(skills);
  db.run(
    "UPDATE products SET title=?,image=?,price=?,oldprice=?,category=?,proqty=? WHERE id=?",
    [title, image, price, oldprice, category, proqty, id],
    function (err) {
      if (err) {
        res.status(500).json({ status: "error", message: err });
      }

      db.run("DELETE FROM skills WHERE proid=?", [id], function (err) {
        if (err) {
          res.status(500).json({ status: "error", message: err });
        }

        const newskills = db.prepare(
          "INSERT INTO skills (skillname,skillvalue,proid) VALUES (?,?,?)"
        );
        skills.forEach((item) => {
          newskills.run([item.skillname, item.skillvalue, id]);
        });
        newskills.finalize();

        db.get("SELECT * FROM shopcart WHERE id=?", [id], (err, rows) => {
          if (err) {
            res.status(500).json({ status: "error", message: err });
          }
          if (rows) {
            if (proqty < rows.count) {
              db.run(
                "UPDATE shopcart SET title=?,image=?,price=?,oldprice=?,category=?,proqty=?,count=? WHERE id=?",
                [title, image, price, oldprice, category, proqty, proqty, id],
                function (err) {
                  if (err) {
                    res.status(500).json({ status: "error", message: err });
                  }
                  res.json({ status: "success", message: "آپدیت انجام شد" });
                }
              );
            } else {
              db.run(
                "UPDATE shopcart SET title=?,image=?,price=?,oldprice=?,category=?,proqty=? WHERE id=?",
                [title, image, price, oldprice, category, proqty, id],
                function (err) {
                  if (err) {
                    res.status(500).json({ status: "error", message: err });
                  }
                  res.json({ status: "success", message: "آپدیت انجام شد" });
                }
              );
            }
          } else {
            res.json({ status: "success", message: "آپدیت انجام شد" });
          }
        });
      });
    }
  );
});

app.post("/addproduct", upload.single("image"), (req, res) => {
  const { id, title, price, oldprice, category, proqty } = req.body;
  let image;
  if (req.existimage) {
    image = req.existfilename;
  } else {
    image = req.file ? req.file.originalname : null;
  }
  db.run(
    `INSERT INTO products (id,title,image,price,oldprice,category,proqty) VALUES (?,?,?,?,?,?,?)`,
    [id, title, image, price, oldprice, category, proqty],
    function (err) {
      if (err) {
        res
          .status(500)
          .json({ status: "error", message: "خطا در ذخیره اطلاعات" });
      }
      res.json({ status: "success", message: "ذخیره شد" });
    }
  );
});

app.post("/deleteproduct", (req, res) => {
  const { id } = req.body;

  db.run("DELETE FROM products WHERE id=?", [id], function (err) {
    if (err) {
      res.status(500).json({ status: "error", message: err });
    }
    res.json({ status: "success", message: "حذف انجام شد" });
  });
});

app.get("/users", (req, res) => {
  db.all(
    `SELECT *, a.address
    FROM users u
    LEFT JOIN addresses a ON u.accessid = a.user_id`,
    (err, rows) => {
      if (err) {
        console.error("خطا در دریافت اطلاعات:", err.message);
        return res.status(500).json({ message: "خطا در دریافت اطلاعات" });
      }
      res.json(rows);
    }
  );
});

app.listen(port, () => {
  console.log("Server Running At Port : " + port);
});
