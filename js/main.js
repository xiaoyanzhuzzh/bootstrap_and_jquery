$(document).ready(function() {
  studentLoading();
  $("#btnSubmit").on("click", function() {
    if (hasEmptyRequiredInput()) {
      $("#alert").modal("show");
      return false;
    }
    Get_scores();
    return false;
  });
});

function setStudent() {
  $('.student').on('click', function() {
    $('#studentClass').attr('value', $(this).attr('data-class'));
    $('#studentNumber').attr('value', $(this).attr('data-id'));
    $('#studentName').attr('value', $(this).text());
  });

  $('#dropdownMenu1').attr('disable');
}

function studentLoading() {
  var students = [
    new Student('Pavel Sokolov', 0, 11),
    new Student('Ilya Solovev', 1, 11),
    new Student('Ilya Erofeev', 2, 10),
  ];
  var studentsHtml = '';

  students.forEach(s => {
    studentsHtml += `
    <li class='student' data-id=${s.id} data-class=${s.className}>
      <a>${s.name}</a>
    </li>`
  });
  
  $('.dropdown-menu').append(studentsHtml);
  setStudent();

}

function inputsInformation(inputs) {
  var text = "";
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    var element = $("#" + input.id);

    if (element && _.isEmpty(element.val())) {
      $("#" + input.divId).addClass("has-error");
      text += input.text + "";
    } else {
      $("#" + input.divId).removeClass("has-error");
    }
  }
  return text;
}

function hasEmptyRequiredInput() {
  var requiredInputs = [
    {
      id: "studentClass",
      text: "class",
      divId: "class"
    },
    {
      id: "studentNumber",
      text: "student ID",
      divId: "number"
    },
    {
      id: "studentName",
      text: "Name",
      divId: "name"
    }
  ];

  var text = inputsInformation(requiredInputs);
  if (text !== "") {
    return true;
  }
  return false;
}

function Get_scores() {
  var value =
    fullInTopics() +
    choiceTopics() +
    multipleChoiceTopics() +
    trueOrFalseTopics() +
    shortAnswerTopics();
  $("#scores").text(value);
  $("#assessments").text(getAssessment(value));
  $("#divScores").addClass("text-danger");
  $("#divAssessment").addClass("text-danger");
}

function getAssessment(value) {
  if(value >= 100) {
    return "5";
  } else if (value >= 75 && value <= 100) {
    return "4";
  } else if(value >= 40 && value <= 75) {
    return "3";
  } else {
    return "2";
  }
}

function fullInTopics() {
  var fullInSubject1 = new Subject(
    "fullInSubject",
    ["Unified Modeling Language"],
    1,
    5
  );
  var fullInSubject2 = new Subject(
    "fullInSubject",
    ["Inheritance", "Polymorphism", "Encapsulation"],
    3,
    5
  );

  var value1_1_1 = $("#gap1").val();

  if (value1_1_1 == fullInSubject1.answer[0]) {
    fullInSubject1.scores += fullInSubject1.scorePerSubject;
  }

  var value1_2 = [];
  value1_2.push($("#gap2_1").val());
  value1_2.push($("#gap2_2").val());
  value1_2.push($("gap2_3").val());

  for (var i = 0; i < fullInSubject2.answer.length; i++) {
    for (var j = 0; j < value1_2.length; j++) {
      if (fullInSubject2.answer[i] == value1_2[j]) {
        fullInSubject2.scores += fullInSubject2.scorePerSubject;
        break;
      }
    }
  }
  return fullInSubject1.scores + fullInSubject2.scores;
}

function choiceTopics() {
  var choiceSubject = new Subject("choiceSubject", ["B", "A"], 2, 10);

  var choiceSubject1 = new ChoiceSubject("radio_ans_1");
  var value1 = choiceSubject1.calculation();
  var choiceSubject2 = new ChoiceSubject("radio_ans_2");
  var value2 = choiceSubject2.calculation();
  var value = [value1, value2];

  for (var i = 0; i < value.length; i++) {
    if (value[i] == choiceSubject.answer[i]) {
      choiceSubject.scores += choiceSubject.scorePerSubject;
    }
  }
  return choiceSubject.scores;
}

function multipleChoiceTopics() {
  var multipleChoiceSubject = new Subject(
    "multipleChoiceSubject",
    [
      ["A", "B", "D"],
      ["A", "B", "C"],
      ["A", "B"]
    ],
    2,
    10
  );

  var multipleChoiceSubject1 = new MultipleChoiceSubject("check_ans_1");
  var value1 = multipleChoiceSubject1.calculation();
  var answer1 = multipleChoiceSubject.answer[0];
  if (answer1.length == value1.length) {
    var diffA = _.difference(value1, answer1);
    if (_.isEmpty(diffA)) {
      multipleChoiceSubject.scores += multipleChoiceSubject.scorePerSubject;
    }
  }

  var multipleChoiceSubject2 = new MultipleChoiceSubject("check_ans_2");
  var value2 = multipleChoiceSubject2.calculation();
  var answer2 = multipleChoiceSubject.answer[1];
  if (answer2.length == value2.length) {
    var diffB = _.difference(value2, answer2);
    if (_.isEmpty(diffB)) {
      multipleChoiceSubject.scores += multipleChoiceSubject.scorePerSubject;
    }
  }

  var multipleChoiceSubject3 = new MultipleChoiceSubject("check_ans_3");
  var value3 = multipleChoiceSubject3.calculation();
  var answer3 = multipleChoiceSubject.answer[2];
  if (answer3.length == value3.length) {
    var diffC = _.difference(value3, answer3);
    if (_.isEmpty(diffC)) {
      multipleChoiceSubject.scores += multipleChoiceSubject.scorePerSubject;
    }
  }
  return multipleChoiceSubject.scores;
}

function trueOrFalseTopics() {
  var trueOrFalseSubject = new Subject(
    "trueOrFalseSubject",
    ["no", "yes"],
    2,
    10
  );
  var trueOrFalseSubject1 = new ChoiceSubject("ans_1");
  var value1 = trueOrFalseSubject1.calculation();
  var trueOrFalseSubject2 = new ChoiceSubject("ans_2");
  var value2 = trueOrFalseSubject2.calculation();
  var value = [value1, value2];

  for (var i = 0; i < value.length; i++) {
    if (value[i] == trueOrFalseSubject.answer[i]) {
      trueOrFalseSubject.scores += trueOrFalseSubject.scorePerSubject;
    }
  }
  return trueOrFalseSubject.scores;
}
// The model is a simplification and abstraction of the real world
function shortAnswerTopics() {
  var shortAnswerSubject = new Subject(
    "shortAnswerSubject",
    [
      `The model is a simplification and abstraction of the real world,
        A model is an expression of the system, process, thing, or concept being studied. It can be a physical entity; it can be a figure; or it can be a mathematical expression.`
    ],
    1,
    20
  );
  var value5 = $("#short5").val();

  if (value5 == shortAnswerSubject.answer[0]) {
    shortAnswerSubject.scores = shortAnswerSubject.scorePerSubject;
  }
  return shortAnswerSubject.scores;
}
