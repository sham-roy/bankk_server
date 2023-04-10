
const jwt = require("jsonwebtoken")
const db = require('./db')

// userDetails = {
//   1000: { username: "anu", acno: "1000", password: "qwe", balance: 0, transaction: [] },
//   1001: { username: "amal", acno: "1001", password: "qwerty1", balance: 0, transaction: [] },
//   1002: { username: "arun", acno: "1002", password: "qwerty1", balance: 0, transaction: [] },
//   1003: { username: "mega", acno: "1003", password: "qwerty1", balance: 0, transaction: [] },
// }

register = (acno, uname, psw) => {
  // to store the resolve output of findOne in a variable user
  return db.User.findOne({ acno }).then(user => {
    // if acno present in db then get the object of that user else null response
    if (user) {
      return {
        status: false,
        message: "usera already present",
        statusCode: 404
      }
    }
    else {
      newUser = new db.User({
        username: uname,
        acno,
        password: psw,
        balance: 0,
        transaction: []
      })
      newUser.save()
      return {
        status: true,
        message: "registered",
        statusCode: 200
      }
    }
  })
}

// login = (acno, psw) => {

//   return db.User.findOne({ acno }).then(user => {
//     if (user) {
//       if (psw == user["password"]) {
//         currentUser = user["username"]
//         currentAcno = acno
//         const token = jwt.sign({ acno }, "superkey123")
//         return {
//           status: true,
//           message: "login sucess",
//           statusCode: 200,
//           currentUser,
//           currentAcno,
//           token
//         }
//       }
//       else {
//         return {
//           status: false,
//           message: "incorrect password",
//           statusCode: 404
//         }
//       }
//     }
//     else {
//       return {
//         status: false,
//         message: "user not exist",
//         statusCode: 404
//       }
//     }
//   })
// }

login = (acno, psw) => {

  return db.User.findOne({ acno, password: psw }).then(user => {

    if (user) {
      currentUser = user.username
      currentAcno = acno
      const token = jwt.sign({ acno }, "superkey123")
      return {
        status: true,
        message: "login sucess",
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      };
    }
    else {
      return {
        status: false,
        message: "user not exist",
        statusCode: 404
      }
    }
  })
}

deposit = (acno, psw, amnt) => {
  // to convert string amount in int
  var amount = parseInt(amnt)
  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {

      user.balance += amount
      user["transaction"].push({ type: "credit", amount: amnt })
      user.save()

      return {
        status: true,
        message: `your ac has been credited with amount ${amount} and thr balance is ${user["balance"]}`,
        statusCode: 200,
      }
    }
    else {
      return {
        staus: false,
        message: "incorrect acnno or psw",
        statusCode: 404
      }
    }
  })
}
// deposit = (acno, psw, amnt) => {
//   // to convert string amount in int
//   amount = parseInt(amnt)
//   if (acno in userDetails) {
//     if (psw == userDetails[acno]["password"]) {
//       userDetails[acno]["balance"]+= amount
//       // add transaction data
//       userDetails[acno]["transaction"].push({ type: "credit", amount: amount })
//       return {
//         status: true,
//         message: `your ac has been credited with amount ${amount} and thr balance is ${userDetails[acno]["balance"]}`,
//         statusCode: 200,
//       }
//     }
//     else {
//       return {
//         staus: false,
//         message: "incorrect psw",
//         statusCode: 404
//       }
//     }
//   }
//   else {
//     return {
//       staus: false,
//       message: "incorrect acno",
//       statusCode: 404
//     }
//   }
// }

withdraw = (acno, psw, amnt) => {
  // to convert string amnt to int
  var amount = parseInt(amnt)
  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      if (amount <= user.balance) {
        user.balance -= amount
        user["transaction"].push({ type: "debited", amount: amnt })
        user.save()

        return {
          status: true,
          message: `your ac has been debited with amount ${amount} and thr balance is ${user["balance"]}`,
          statusCode: 200,
        }
      }
      else {
        return {
          status: false,
          message: "insufficient balance",
          statusCode: 400
        }
      }
    }
    else {
      return {
        staus: false,
        message: "incorrect acnno or psw",
        statusCode: 404
      }
    }
  })
}

getTranscation = (acno) => {
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return {
        staus: true,
        transaction: user.transaction,
        statusCode: 200
      }
    }
  })
}

deleteACC = (acno) => {
  return db.User.deleteOne({ acno }).then(user => {
    if (user) {
      return {
        staus: true,
        message: "acno not present",
        statusCode: 401
      }
    }
  })
}

module.exports = {
  register, login, deposit, withdraw, getTranscation
}