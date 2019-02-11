let inquirer = require("inquirer");
const { exec } = require("child_process");

const fs = require("fs");

const pdfMerger = require("pdf-merger-trvl");

let filesToRename = [];

let allFiles = [];

console.clear();
fs.readdir("./", (err, files) => {
  allFiles = files;
});
console.log("       ╔════════════════════════╗");
console.log("       ║                        ║");
console.log("       ║  Road Vantage - Admin  ║");
console.log("       ║                        ║");
console.log("       ║     Batch Rename v1    ║");
console.log("       ║                        ║");
console.log("       ╚════════════════════════╝");

inquirer
  .prompt({
    name: "option",
    type: "list",
    message: "Please select an option",
    choices: ["Rename Batches", "Quit"]
  })
  .then(answers => {
    if (answers.option === "Quit") {
      return;
    }
    if (answers.option === "Rename Batches") {
      inquirer
        .prompt({
          name: "initials",
          type: "string",
          message: "Please Enter Admin Initials"
        })
        .then(answer => {
          console.log("   The following files will be affected;");
          console.log();
          allFiles.forEach(file => {
            if (file.slice(-6) === "_B.pdf" || file.slice(-7) === "_LB.pdf") {
              filesToRename.push(file);

              console.log(
                "       " +
                  file +
                  " -> " +
                  file.slice(0, file.length - 4) +
                  "_" +
                  answer.initials.toUpperCase() +
                  file.slice(-4)
              );
            }
          });
          console.log();

          inquirer
            .prompt({
              name: "option",
              type: "list",
              message: "Would you like to proceed?",
              choices: [
                "Yes proceed rename only",
                "Yes proceed and add QC Sheet",
                "No, quit."
              ]
            })
            .then(answers => {
              if (answers.option === "No, quit.") {
                return;
              }
              if (answers.option === "Yes proceed rename only") {
                exec(`ren *_B.pdf *_B_${answer.initials.toUpperCase()}.pdf`);
                exec(`ren *_LB.pdf *_LB_${answer.initials.toUpperCase()}.pdf`);

                console.log(
                  "Process finished succesfully! Please revise your folder."
                );
                exec("pause");
              }

              if (answers.option === "Yes proceed and add QC Sheet") {
                filesToRename.forEach(file => {
                  let merger = new pdfMerger();

                  merger.add("./QC.pdf"); //merge all pages. parameter is the path to file and filename.
                  console.log(`Adding :${file}|`);
                  merger.add("./" + file); // merge only page 2
                  console.log(`Merging :${file}|`);
                  merger.save(file); //save under given name
                });

                console.log(
                  "Process finished succesfully! Please revise your folder."
                );
                exec(`ren *_B.pdf *_B_${answer.initials.toUpperCase()}.pdf`);
                exec(`ren *_LB.pdf *_LB_${answer.initials.toUpperCase()}.pdf`);
                exec("pause");
              }
            });
        });
    }
  });
