const http = require('http');
const url = require('url');
const Handler = require('./handles/Handle')
const qs = require("qs");
let formidable = require('formidable');
const fs = require("fs");

let users = [];
const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;
    const methodRequest = req.method;

    // xu ly router
    switch (pathName) {
        case '/':
            Handler.showHome(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin':
            Handler.showDashboard(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin/users':
            // kiem tra session
            // lay  thong tin session tu cookie cua request
            let cookie = req.headers.cookie;
            let usernameLogin = qs.parse(cookie).u_user;
            if (!usernameLogin) {
                res.writeHead(301, {Location: '/admin/login'})
                return res.end();
            }

            Handler.showListUsers(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin/users/delete':
            Handler.deleteUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/delete':
            Handler.deleteBoook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/create':
            Handler.showFormCreateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/store':
            Handler.storeUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/update':
            Handler.showFormUpdateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/edit':
            Handler.updateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break
        case '/admin/login':
            if (methodRequest == 'GET') {
                Handler.showFormLogin(req, res).catch(err => {
                    console.log(err.message)
                })
            }
            else {
                Handler.login(req, res).catch(err => {
                    console.log(err.message)
                })
            }
            break;
        case '/admin/register':
            Handler.showFormRegister(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/register/success':
            Handler.createUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/create':
            Handler.showFormCreateBook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/store':
            Handler.storeBook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/update':
            Handler.showFormUpdateBook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/edit':
            Handler.updateBook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/uploadimage':
            fs.readFile('./views/register.html', function (err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            });
            break;
        case '/upload':
            // Kh???i t???o bi???n form b???ng IncomingForm ????? ph??n t??ch m???t t???p tin t???i l??n
            let form = new formidable.IncomingForm();
            // C???u h??nh th?? m???c s??? ch???a file tr??n server v???i h??m .uploadDir
            form.uploadDir = "upload/"
            // X??? l?? upload file v???i h??m .parse
            form.parse(req, function (err, fields, files) {
                // T???o ?????i t?????ng user
                let userInfo = {
                    // name: fields.name,
                    // email: fields.email,
                    // password: fields.password,
                };

                if (err) {
                    // Ki???m tra n???u c?? l???i
                    console.error(err.message);
                    return res.end(err.message);
                }
                // L???y ra ???????ng d???n t???m c???a t???p tin tr??n server
                let tmpPath = files.avatar.filepath;
                // Kh???i t???o ???????ng d???n m???i, m???c ????ch ????? l??u file v??o th?? m???c uploads c???a ch??ng ta
                let newPath = form.uploadDir + files.avatar.originalFilename;
                // T???o thu???c t??nh avatar v?? g??n gi?? tr??? cho n??
                userInfo.avatar = newPath;
                // ?????i t??n c???a file t???m th??nh t??n m???i v?? l??u l???i
                fs.rename(tmpPath, newPath, (err) => {
                    if (err) throw err;
                    let fileType = files.avatar.mimeType;
                    let mimeTypes = ["image/jpeg", "image/jpg", "image/png"];
                    if (mimeTypes.indexOf(fileType) === -1) {
                        res.writeHead(200, {"Content-Type": "text/html"});
                        return res.end('The file is not in the correct format: png, jpeg, jpg');
                    }
                });
                users.push(userInfo);
                console.log(users)
                res.end('Register success!');
            });
            break;
        case '/admin/logout2':
            Handler.logout(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/Boook/lichsu':
            Handler.showBookLichsu(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/Boook/triethoc':
            Handler.showBookTrietHoc(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/Boook/giaoduc':
            Handler.showBookgiaoduc(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/Boook/truyen':
            Handler.showBooktruyen(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/seads':
            Handler.showBooksearch(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        default:
            res.end();
    }
})

server.listen(8001, 'localhost', () => {
    console.log('server listening on port' + 8001)
})
// `<img src="upload/${}">`
