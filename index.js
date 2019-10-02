var mysql = require('mysql')
var cTable = require('console.table')
var inquirer = require('inquirer')

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'todo_listDB'
})

connection.connect(function(err) {
  if (err) throw err
  promptUserForAction()
})

function promptUserForAction() {
  // display all todos
  connection.query('SELECT * FROM todos', function(err, results) {
    if (err) {
      throw err
    }

    if (results.length === 0) {
      // if there are no results, display "No todos in list yet."
      console.log('No todos in list yet.')
    } else {
      console.table(results)
    }
    // prompt user for action
    inquirer
      .prompt([
        {
          name: 'action',
          type: 'list',
          message: 'What would you like to do?',
          choices: ['Add Item', 'Mark Item Done', 'Exit']
        }
      ])
      .then(function(answers) {
        // determine which action the user chose
        switch (answers.action) {
          case 'Add Item':
            addNewTodo()
            return

          case 'Mark Item Done':
            markItemAsDone()
            return

          default:
            connection.end()
        }
      })
  })
}

function addNewTodo() {
  inquirer
    .prompt([
      {
        name: 'description',
        type: 'input',
        message: 'Enter new task description:'
      }
    ])
    .then(function(answers) {
      connection.query(
        'INSERT INTO todos SET ?',
        { description: answers.description },
        function(err, res) {
          if (err) throw err
          console.log('New task added successfully.')
          promptUserForAction()
        }
      )
    })
}

function markItemAsDone() {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: 'Enter the item id:'
      }
    ])
    .then(function(answers) {
      connection.query(
        'UPDATE todos SET is_done = true WHERE ?',
        {
          id: answers.id
        },
        function(err) {
          if (err) throw err
          promptUserForAction()
        }
      )
    })
}
