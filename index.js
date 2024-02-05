const express = require('express')
const { uid, randomUUID } = require('crypto')
const app = express();
const fs = require('fs')

app.use(express.json())

const getUserdata = () => {
    const userData = fs.readFileSync("data/user.json")
    return JSON.parse(userData)
}

const writeUserdata = (data) => {
    const writeData = JSON.stringify(data);
    fs.writeFileSync("data/user.json", writeData);

}

// Get Userlist
app.get('/userlist', (req, res) => {  
    const value = getUserdata();
    res.send(value);
})

// Add Userlist
app.post('/adduser', (req, res) => {
    const userExsist = getUserdata();
    let uid = randomUUID();
    const userdata = req.body;
    userdata.id = uid;
    if (userdata.first_name == null || userdata.last_name == null) {
        res.status(201).send({ error: true, msg: "User Data Incomplete" });
    }

    userExsist.push(userdata);
    writeUserdata(userExsist);
    res.send({ success: true, msg: "User Add Successfully" });
})

// Update Userlist
app.put('/updateuser/:id', (req, res) => {
    const id = req.params.id;
    const userData = req.body;
    userData.id = id;
    const existUser = getUserdata();
    const findExist = existUser.find((user) => user.id === id);
    if (!findExist) {
        return res.status(409).send({ error: true, msg: "user ID not exist" });
    }
    const updateuser = existUser.filter((user) => user.id !== id);
    updateuser.push(userData);
    writeUserdata(updateuser);
    res.send({ success: true, msg: "user updated successfully" });
});

// Delete Userlist
app.delete('/deleteuser/:id', (req, res) => {
    const id = req.params.id;
    const exsistUser = getUserdata();
    const filterUser = exsistUser.filter((user) => user.id !== id);
    if (exsistUser.length === filterUser.length) {
        return res.status(409).send({ error: true, msg: "ID does not exist" });
    }
    writeUserdata(filterUser);
    res.send({ success: true, msg: "user removed successfully" });
});

console.log(getUserdata());
app.listen(3500, () => {
    console.log('Server Working');
});