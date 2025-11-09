import "./app.min.js";
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function normalizeComputedStyleValue(string) {
  return +string.replace(/px/, "");
}
function fixDPR(canvas) {
  var dpr = window.devicePixelRatio;
  var computedStyles = getComputedStyle(canvas);
  var width = normalizeComputedStyleValue(computedStyles.getPropertyValue("width"));
  var height = normalizeComputedStyleValue(computedStyles.getPropertyValue("height"));
  canvas.setAttribute("width", (width * dpr).toString());
  canvas.setAttribute("height", (height * dpr).toString());
}
function generateRandomNumber(min, max) {
  var fractionDigits = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
  var randomNumber = Math.random() * (max - min) + min;
  return Math.floor(randomNumber * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
}
function generateRandomArrayElement(arr) {
  return arr[generateRandomNumber(0, arr.length)];
}
var FREE_FALLING_OBJECT_ACCELERATION = 125e-5;
var MIN_DRAG_FORCE_COEFFICIENT = 5e-4;
var MAX_DRAG_FORCE_COEFFICIENT = 9e-4;
var ROTATION_SLOWDOWN_ACCELERATION = 1e-5;
var INITIAL_SHAPE_RADIUS = 6;
var INITIAL_EMOJI_SIZE = 80;
var MIN_INITIAL_CONFETTI_SPEED = 0.9;
var MAX_INITIAL_CONFETTI_SPEED = 1.7;
var MIN_FINAL_X_CONFETTI_SPEED = 0.2;
var MAX_FINAL_X_CONFETTI_SPEED = 0.6;
var MIN_INITIAL_ROTATION_SPEED = 0.03;
var MAX_INITIAL_ROTATION_SPEED = 0.07;
var MIN_CONFETTI_ANGLE_IN_DEGREES = 15;
var MAX_CONFETTI_ANGLE_IN_DEGREES = 82;
var SHAPE_VISIBILITY_TRESHOLD = 100;
var DEFAULT_CONFETTI_NUMBER = 250;
var DEFAULT_EMOJIS_NUMBER = 40;
var DEFAULT_CONFETTI_COLORS = ["#fcf403", "#62fc03", "#f4fc03", "#03e7fc", "#03fca5", "#a503fc", "#fc03ad", "#fc03c2"];
function getWindowWidthCoefficient(canvasWidth) {
  var HD_SCREEN_WIDTH = 1920;
  return Math.log(canvasWidth) / Math.log(HD_SCREEN_WIDTH);
}
var ConfettiShape = /* @__PURE__ */ function() {
  function ConfettiShape2(args) {
    _classCallCheck(this, ConfettiShape2);
    var initialPosition = args.initialPosition, confettiRadius = args.confettiRadius, confettiColors = args.confettiColors, emojis = args.emojis, emojiSize = args.emojiSize, canvasWidth = args.canvasWidth, initialFlightAngle = args.initialFlightAngle, rotationAngle = args.rotationAngle, _args$__DO_NOT_USE__s = args.__DO_NOT_USE__shouldHideConfettiInShiftedPosition, __DO_NOT_USE__shouldHideConfettiInShiftedPosition = _args$__DO_NOT_USE__s === void 0 ? false : _args$__DO_NOT_USE__s;
    var randomConfettiSpeed = generateRandomNumber(MIN_INITIAL_CONFETTI_SPEED, MAX_INITIAL_CONFETTI_SPEED, 3);
    var initialSpeed = randomConfettiSpeed * getWindowWidthCoefficient(canvasWidth);
    this.confettiSpeed = {
      x: initialSpeed,
      y: initialSpeed
    };
    this.finalConfettiSpeedX = generateRandomNumber(MIN_FINAL_X_CONFETTI_SPEED, MAX_FINAL_X_CONFETTI_SPEED, 3);
    this.rotationSpeed = emojis.length ? 0.01 : generateRandomNumber(MIN_INITIAL_ROTATION_SPEED, MAX_INITIAL_ROTATION_SPEED, 3) * getWindowWidthCoefficient(canvasWidth);
    this.dragForceCoefficient = generateRandomNumber(MIN_DRAG_FORCE_COEFFICIENT, MAX_DRAG_FORCE_COEFFICIENT, 6);
    this.radius = {
      x: confettiRadius,
      y: confettiRadius
    };
    this.initialRadius = confettiRadius;
    this.rotationAngle = rotationAngle;
    this.emojiSize = emojiSize;
    this.emojiRotationAngle = generateRandomNumber(0, 2 * Math.PI);
    this.radiusYUpdateDirection = "down";
    this.cos = Math.cos(initialFlightAngle);
    this.sin = Math.sin(initialFlightAngle);
    var positionShift = generateRandomNumber(-150, 0);
    var shiftedInitialPosition = {
      x: initialPosition.x + positionShift * this.sin,
      y: initialPosition.y - positionShift * this.cos
    };
    this.dispatchPosition = Object.assign({}, initialPosition);
    this.currentPosition = Object.assign({}, shiftedInitialPosition);
    this.initialPosition = Object.assign({}, shiftedInitialPosition);
    this.color = emojis.length ? null : generateRandomArrayElement(confettiColors);
    this.emoji = emojis.length ? generateRandomArrayElement(emojis) : null;
    this.createdAt = (/* @__PURE__ */ new Date()).getTime();
    this.isVisible = !__DO_NOT_USE__shouldHideConfettiInShiftedPosition;
  }
  return _createClass(ConfettiShape2, [{
    key: "draw",
    value: function draw(canvasContext) {
      var currentPosition = this.currentPosition, radius = this.radius, color = this.color, emoji = this.emoji, rotationAngle = this.rotationAngle, emojiRotationAngle = this.emojiRotationAngle, emojiSize = this.emojiSize, isVisible = this.isVisible;
      if (!isVisible) return;
      var dpr = window.devicePixelRatio;
      if (color) {
        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.ellipse(currentPosition.x * dpr, currentPosition.y * dpr, radius.x * dpr, radius.y * dpr, rotationAngle, 0, 2 * Math.PI);
        canvasContext.fill();
      } else if (emoji) {
        canvasContext.font = "".concat(emojiSize, "px serif");
        canvasContext.save();
        canvasContext.translate(dpr * currentPosition.x, dpr * currentPosition.y);
        canvasContext.rotate(emojiRotationAngle);
        canvasContext.textAlign = "center";
        canvasContext.fillText(emoji, 0, 0);
        canvasContext.restore();
      }
    }
  }, {
    key: "updatePosition",
    value: function updatePosition(iterationTimeDelta, currentTime) {
      var confettiSpeed = this.confettiSpeed, dragForceCoefficient = this.dragForceCoefficient, finalConfettiSpeedX = this.finalConfettiSpeedX, radiusYUpdateDirection = this.radiusYUpdateDirection, rotationSpeed = this.rotationSpeed, createdAt = this.createdAt;
      var timeDeltaSinceCreation = currentTime - createdAt;
      if (confettiSpeed.x > finalConfettiSpeedX) this.confettiSpeed.x -= dragForceCoefficient * iterationTimeDelta;
      this.currentPosition.x += confettiSpeed.x * this.sin * iterationTimeDelta;
      this.currentPosition.y = this.initialPosition.y - confettiSpeed.y * this.cos * timeDeltaSinceCreation + FREE_FALLING_OBJECT_ACCELERATION * Math.pow(timeDeltaSinceCreation, 2) / 2;
      if (this.currentPosition.y <= this.dispatchPosition.y) {
        this.isVisible = true;
      }
      this.rotationSpeed -= this.emoji ? 1e-4 : ROTATION_SLOWDOWN_ACCELERATION * iterationTimeDelta;
      if (this.rotationSpeed < 0) this.rotationSpeed = 0;
      if (this.emoji) {
        this.emojiRotationAngle += this.rotationSpeed * iterationTimeDelta % (2 * Math.PI);
        return;
      }
      if (radiusYUpdateDirection === "down") {
        this.radius.y -= iterationTimeDelta * rotationSpeed;
        if (this.radius.y <= 0) {
          this.radius.y = 0;
          this.radiusYUpdateDirection = "up";
        }
      } else {
        this.radius.y += iterationTimeDelta * rotationSpeed;
        if (this.radius.y >= this.initialRadius) {
          this.radius.y = this.initialRadius;
          this.radiusYUpdateDirection = "down";
        }
      }
    }
  }, {
    key: "getIsVisibleOnCanvas",
    value: function getIsVisibleOnCanvas(canvasHeight) {
      return this.currentPosition.y < canvasHeight + SHAPE_VISIBILITY_TRESHOLD;
    }
  }]);
}();
function createCanvas() {
  var canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "1000";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);
  return canvas;
}
function normalizeConfettiConfig(confettiConfig) {
  var _confettiConfig$confe = confettiConfig.confettiRadius, confettiRadius = _confettiConfig$confe === void 0 ? INITIAL_SHAPE_RADIUS : _confettiConfig$confe, _confettiConfig$confe2 = confettiConfig.confettiNumber, confettiNumber = _confettiConfig$confe2 === void 0 ? confettiConfig.confettiesNumber || (confettiConfig.emojis ? DEFAULT_EMOJIS_NUMBER : DEFAULT_CONFETTI_NUMBER) : _confettiConfig$confe2, _confettiConfig$confe3 = confettiConfig.confettiColors, confettiColors = _confettiConfig$confe3 === void 0 ? DEFAULT_CONFETTI_COLORS : _confettiConfig$confe3, _confettiConfig$emoji = confettiConfig.emojis, emojis = _confettiConfig$emoji === void 0 ? confettiConfig.emojies || [] : _confettiConfig$emoji, _confettiConfig$emoji2 = confettiConfig.emojiSize, emojiSize = _confettiConfig$emoji2 === void 0 ? INITIAL_EMOJI_SIZE : _confettiConfig$emoji2, _confettiConfig$__DO_ = confettiConfig.__DO_NOT_USE__confettiDispatchPosition, __DO_NOT_USE__confettiDispatchPosition = _confettiConfig$__DO_ === void 0 ? null : _confettiConfig$__DO_;
  if (confettiConfig.emojies) console.error("emojies argument is deprecated, please use emojis instead");
  if (confettiConfig.confettiesNumber) console.error("confettiesNumber argument is deprecated, please use confettiNumber instead");
  return {
    confettiRadius,
    confettiNumber,
    confettiColors,
    emojis,
    emojiSize,
    __DO_NOT_USE__confettiDispatchPosition
  };
}
function convertDegreesToRadians(degreesToRadians) {
  return degreesToRadians * Math.PI / 180;
}
function generateConfettiInitialFlightAngleFiredFromLeftSideOfTheScreen() {
  return convertDegreesToRadians(generateRandomNumber(MAX_CONFETTI_ANGLE_IN_DEGREES, MIN_CONFETTI_ANGLE_IN_DEGREES));
}
function generateConfettiInitialFlightAngleFiredFromRightSideOfTheScreen() {
  return convertDegreesToRadians(generateRandomNumber(-15, -82));
}
function generateConfettiInitialFlightAngleFiredFromSpecificPosition() {
  return convertDegreesToRadians(generateRandomNumber(-82, MAX_CONFETTI_ANGLE_IN_DEGREES));
}
function generateConfettiRotationAngleFiredFromLeftSideOfTheScreen() {
  return generateRandomNumber(0, 0.2, 3);
}
function generateConfettiRotationAngleFiredFromRightSideOfTheScreen() {
  return generateRandomNumber(-0.2, 0, 3);
}
var ConfettiBatch = /* @__PURE__ */ function() {
  function ConfettiBatch2(canvasContext) {
    var _this = this;
    _classCallCheck(this, ConfettiBatch2);
    this.canvasContext = canvasContext;
    this.shapes = [];
    this.promise = new Promise(function(completionCallback) {
      return _this.resolvePromise = completionCallback;
    });
  }
  return _createClass(ConfettiBatch2, [{
    key: "getBatchCompletePromise",
    value: function getBatchCompletePromise() {
      return this.promise;
    }
  }, {
    key: "addShapes",
    value: function addShapes() {
      var _this$shapes;
      (_this$shapes = this.shapes).push.apply(_this$shapes, arguments);
    }
  }, {
    key: "complete",
    value: function complete() {
      var _a;
      if (this.shapes.length) {
        return false;
      }
      (_a = this.resolvePromise) === null || _a === void 0 ? void 0 : _a.call(this);
      return true;
    }
  }, {
    key: "processShapes",
    value: function processShapes(time, canvasHeight, cleanupInvisibleShapes) {
      var _this2 = this;
      var timeDelta = time.timeDelta, currentTime = time.currentTime;
      this.shapes = this.shapes.filter(function(shape) {
        shape.updatePosition(timeDelta, currentTime);
        shape.draw(_this2.canvasContext);
        if (!cleanupInvisibleShapes) {
          return true;
        }
        return shape.getIsVisibleOnCanvas(canvasHeight);
      });
    }
  }]);
}();
var JSConfetti = /* @__PURE__ */ function() {
  function JSConfetti2() {
    var jsConfettiConfig = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _classCallCheck(this, JSConfetti2);
    this.activeConfettiBatches = [];
    this.canvas = jsConfettiConfig.canvas || createCanvas();
    this.canvasContext = this.canvas.getContext("2d");
    this.requestAnimationFrameRequested = false;
    this.lastUpdated = (/* @__PURE__ */ new Date()).getTime();
    this.iterationIndex = 0;
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }
  return _createClass(JSConfetti2, [{
    key: "loop",
    value: function loop() {
      this.requestAnimationFrameRequested = false;
      fixDPR(this.canvas);
      var currentTime = (/* @__PURE__ */ new Date()).getTime();
      var timeDelta = currentTime - this.lastUpdated;
      var canvasHeight = this.canvas.offsetHeight;
      var cleanupInvisibleShapes = this.iterationIndex % 10 === 0;
      this.activeConfettiBatches = this.activeConfettiBatches.filter(function(batch) {
        batch.processShapes({
          timeDelta,
          currentTime
        }, canvasHeight, cleanupInvisibleShapes);
        if (!cleanupInvisibleShapes) {
          return true;
        }
        return !batch.complete();
      });
      this.iterationIndex++;
      this.queueAnimationFrameIfNeeded(currentTime);
    }
  }, {
    key: "queueAnimationFrameIfNeeded",
    value: function queueAnimationFrameIfNeeded(currentTime) {
      if (this.requestAnimationFrameRequested) {
        return;
      }
      if (this.activeConfettiBatches.length < 1) {
        return;
      }
      this.requestAnimationFrameRequested = true;
      this.lastUpdated = currentTime || (/* @__PURE__ */ new Date()).getTime();
      requestAnimationFrame(this.loop);
    }
  }, {
    key: "__DO_NOT_USE_THIS_IS_UNDER_DEVELOPMENT__addConfettiAtPosition",
    value: function __DO_NOT_USE_THIS_IS_UNDER_DEVELOPMENT__addConfettiAtPosition() {
      var confettiConfig = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var _normalizeConfettiCon = normalizeConfettiConfig(confettiConfig), confettiRadius = _normalizeConfettiCon.confettiRadius, confettiNumber = _normalizeConfettiCon.confettiNumber, confettiColors = _normalizeConfettiCon.confettiColors, emojis = _normalizeConfettiCon.emojis, emojiSize = _normalizeConfettiCon.emojiSize, __DO_NOT_USE__confettiDispatchPosition = _normalizeConfettiCon.__DO_NOT_USE__confettiDispatchPosition;
      var _this$canvas$getBound = this.canvas.getBoundingClientRect(), canvasWidth = _this$canvas$getBound.width;
      var confettiGroup = new ConfettiBatch(this.canvasContext);
      for (var i = 0; i < confettiNumber; i++) {
        var confettiShape = new ConfettiShape({
          initialPosition: __DO_NOT_USE__confettiDispatchPosition,
          confettiRadius,
          confettiColors,
          confettiNumber,
          emojis,
          emojiSize,
          canvasWidth,
          rotationAngle: generateConfettiRotationAngleFiredFromLeftSideOfTheScreen(),
          initialFlightAngle: generateConfettiInitialFlightAngleFiredFromSpecificPosition(),
          __DO_NOT_USE__shouldHideConfettiInShiftedPosition: true
        });
        confettiGroup.addShapes(confettiShape);
      }
      this.activeConfettiBatches.push(confettiGroup);
      this.queueAnimationFrameIfNeeded();
      return confettiGroup.getBatchCompletePromise();
    }
  }, {
    key: "addConfetti",
    value: function addConfetti() {
      var confettiConfig = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var _normalizeConfettiCon2 = normalizeConfettiConfig(confettiConfig), confettiRadius = _normalizeConfettiCon2.confettiRadius, confettiNumber = _normalizeConfettiCon2.confettiNumber, confettiColors = _normalizeConfettiCon2.confettiColors, emojis = _normalizeConfettiCon2.emojis, emojiSize = _normalizeConfettiCon2.emojiSize;
      var _this$canvas$getBound2 = this.canvas.getBoundingClientRect(), canvasWidth = _this$canvas$getBound2.width, canvasHeight = _this$canvas$getBound2.height;
      var yPosition = canvasHeight * 5 / 7;
      var leftConfettiPosition = {
        x: 0,
        y: yPosition
      };
      var rightConfettiPosition = {
        x: canvasWidth,
        y: yPosition
      };
      var confettiGroup = new ConfettiBatch(this.canvasContext);
      for (var i = 0; i < confettiNumber / 2; i++) {
        var confettiOnTheLeft = new ConfettiShape({
          initialPosition: leftConfettiPosition,
          confettiRadius,
          confettiColors,
          confettiNumber,
          emojis,
          emojiSize,
          canvasWidth,
          rotationAngle: generateConfettiRotationAngleFiredFromLeftSideOfTheScreen(),
          initialFlightAngle: generateConfettiInitialFlightAngleFiredFromLeftSideOfTheScreen()
        });
        var confettiOnTheRight = new ConfettiShape({
          initialPosition: rightConfettiPosition,
          confettiRadius,
          confettiColors,
          confettiNumber,
          emojis,
          emojiSize,
          canvasWidth,
          rotationAngle: generateConfettiRotationAngleFiredFromRightSideOfTheScreen(),
          initialFlightAngle: generateConfettiInitialFlightAngleFiredFromRightSideOfTheScreen()
        });
        confettiGroup.addShapes(confettiOnTheRight, confettiOnTheLeft);
      }
      this.activeConfettiBatches.push(confettiGroup);
      this.queueAnimationFrameIfNeeded();
      return confettiGroup.getBatchCompletePromise();
    }
  }, {
    key: "clearCanvas",
    value: function clearCanvas() {
      this.activeConfettiBatches = [];
    }
  }, {
    key: "destroyCanvas",
    value: function destroyCanvas() {
      this.canvas.remove();
    }
  }]);
}();
const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Madrid", "Berlin", "Paris", "Rome"],
    answer: "Paris"
  },
  {
    question: "Which of these are primary colors? (Select all that apply)",
    options: ["Red", "Blue", "Green", "Yellow"],
    answer: ["Red", "Blue", "Yellow"],
    multiple: true
    // Flag to indicate multiple correct answers
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    answer: "Mars"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "Leo Tolstoy", "William Shakespeare", "Mark Twain"],
    answer: "William Shakespeare"
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
    answer: "Blue Whale"
  },
  {
    question: "Which element has the chemical symbol O?",
    options: ["Gold", "Oxygen", "Osmium", "Iron"],
    answer: "Oxygen"
  },
  {
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    answer: "7"
  },
  {
    question: "What is the tallest mountain in the world?",
    options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"],
    answer: "Mount Everest"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
    answer: "Leonardo da Vinci"
  },
  {
    question: "Which ocean is the largest?",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    answer: "Pacific Ocean"
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    answer: "2"
  }
];
const quizSettings = {
  countDown: false,
  // Флаг для обратного отсчета
  countUp: true,
  // Флаг для счетчика времени
  progressBar: true,
  // Флаг для прогресс-бара
  progressNumber: true,
  // Флаг для отображения номера вопроса
  prevButton: true,
  // Флаг для отображения кнопки "Назад"
  restartButton: true,
  // Флаг для отображения кнопки "Перезапустить квиз"
  showAllQuestions: false,
  // Флаг для отображения всех вопросов
  showCorrectAnswers: true,
  // Флаг для отображения правильных ответов
  MinimumQualifiedAnswerQuantity: 5
  // Минимальное количество правильных ответов
};
function quizInit(quizData2, features = {}) {
  const settings = {
    countDown: features.countDown || false,
    // Флаг для обратного отсчета
    countUp: features.countUp || false,
    // Флаг для счетчика времени
    progressBar: features.progressBar || false,
    // Флаг для прогресс-бара
    progressNumber: features.progressNumber || false,
    // Флаг для отображения номера вопроса
    prevButton: features.prevButton || false,
    // Флаг для отображения кнопки "Назад"
    restartButton: features.restartButton || false,
    // Флаг для отображения кнопки "Перезапустить квиз"
    showAllQuestions: features.showAllQuestions || false,
    // Флаг для отображения всех вопросов
    showCorrectAnswers: features.showCorrectAnswers || false,
    // Флаг для отображения правильных ответов
    MinimumQualifiedAnswerQuantity: features.MinimumQualifiedAnswerQuantity || 5
    // Минимальное количество правильных ответов
  };
  const quiz__container = document.querySelector(".quiz__container");
  const quiz__questionBox = document.querySelector(".quiz__question-box");
  const questionEl = document.createElement("h2");
  questionEl.classList.add("quiz__question");
  const optionList = document.createElement("ul");
  optionList.classList.add("quiz__options");
  const quiz__header = document.querySelector(".quiz__header");
  let quizNumber = 0;
  let userAnswers = Array(quizData2.length).fill(null);
  const jsConfetti = new JSConfetti();
  function comment(text) {
    const comment2 = document.createComment(text);
    return comment2;
  }
  function insertAfter(newNode, referenceNode) {
    if (referenceNode.parentNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
  }
  let quizSettingsContainer;
  if (settings.countDown || settings.countUp || settings.progressBar || settings.progressNumber) {
    quizSettingsContainer = document.createElement("div");
    quizSettingsContainer.classList.add("quiz__settings-container");
    insertAfter(quizSettingsContainer, quiz__header);
    quiz__container.insertBefore(comment("Settings"), quizSettingsContainer);
  }
  const passingScoreContainer = document.createElement("div");
  const passingScoreNumber = document.createElement("span");
  passingScoreNumber.innerHTML = settings.MinimumQualifiedAnswerQuantity;
  passingScoreContainer.classList.add("quiz__passing-score");
  passingScoreContainer.innerText = `Passing Score: `;
  quizSettingsContainer.appendChild(passingScoreContainer);
  passingScoreContainer.appendChild(passingScoreNumber);
  function renderQuizBox() {
    quiz__questionBox.innerHTML = "";
    quiz__questionBox.append(questionEl, optionList);
  }
  renderQuizBox();
  const nextBtn = document.createElement("button");
  nextBtn.classList.add("quiz__next-button");
  nextBtn.innerText = quizNumber === quizData2.length - 1 ? "Finish Quiz" : "Next Question";
  function renderQuiz() {
    quiz__questionBox.innerHTML = "";
    settings.progressNumber && !settings.showAllQuestions ? updateProgressNumber() : "";
    quiz__controls.appendChild(nextBtn);
    if (settings.showAllQuestions) {
      quizData2.forEach((q, i) => quiz__questionBox.appendChild(renderQuestion(q, i)));
    } else {
      quiz__questionBox.appendChild(renderQuestion(quizData2[quizNumber], quizNumber, true));
    }
    scrollToTop();
  }
  function renderQuestion(questionData, index, singleMode = false) {
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("quiz-question-container");
    const questionEl2 = document.createElement("h2");
    questionEl2.classList.add("quiz__question");
    questionEl2.innerText = singleMode ? questionData.question : `${index + 1}. ${questionData.question}`;
    questionContainer.appendChild(questionEl2);
    const optionList2 = document.createElement("ul");
    optionList2.classList.add("quiz__options");
    questionData.options.forEach((optionText) => {
      const option = document.createElement("div");
      option.classList.add("quiz__option");
      option.innerText = optionText;
      if (Array.isArray(userAnswers[index]) ? userAnswers[index].includes(optionText) : userAnswers[index] === optionText) {
        option.classList.add("selected");
      }
      option.addEventListener("click", () => {
        if (questionData.multiple) {
          option.classList.toggle("selected");
          userAnswers[index] = Array.from(optionList2.querySelectorAll(".quiz__option.selected")).map((o) => o.innerText);
        } else {
          optionList2.querySelectorAll(".quiz__option").forEach((o) => o.classList.remove("selected"));
          option.classList.add("selected");
          userAnswers[index] = optionText;
        }
        settings.progressBar ? updateProgressBar() : "";
      });
      optionList2.appendChild(option);
    });
    questionContainer.appendChild(optionList2);
    return questionContainer;
  }
  const timerBlock = document.createElement("div");
  timerBlock.classList.add("quiz__timer");
  const timerEl = document.createElement("span");
  timerEl.id = "timer";
  settings.countDown ? timerBlock.appendChild(timerEl) : null;
  settings.countDown || settings.countUp ? quizSettingsContainer.appendChild(timerBlock) : null;
  let timer;
  let timeMinutes = 0;
  let timeSeconds = 5;
  let timeLeft = timeMinutes * 60 + timeSeconds;
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  function startCountDown() {
    clearInterval(timer);
    timerEl.innerText = formatTime(timeLeft);
    timer = setInterval(() => {
      timeLeft--;
      timerEl.innerText = formatTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timer);
        showResults();
      }
    }, 1e3);
  }
  const countUpEl = document.createElement("span");
  countUpEl.id = "countUp";
  countUpEl.innerText = "0";
  settings.countUp && !settings.countDown ? timerBlock.appendChild(countUpEl) : null;
  let countUpTimer;
  let elapsedTime = 0;
  function startCountUp() {
    clearInterval(countUpTimer);
    elapsedTime = 0;
    countUpTimer = setInterval(() => {
      elapsedTime++;
      countUpEl.innerText = formatTime(elapsedTime);
    }, 1e3);
  }
  function stopTime() {
    if (settings.countDown) {
      clearInterval(timer);
    } else if (settings.countUp) {
      clearInterval(countUpTimer);
    }
  }
  function timeReset(minutes = timeMinutes, seconds = timeSeconds) {
    if (settings.countDown) {
      timeLeft = minutes * 60 + seconds;
      startCountDown();
    } else if (settings.countUp) {
      clearInterval(countUpTimer);
      elapsedTime = 0;
      countUpEl.innerText = formatTime(elapsedTime);
      startCountUp();
    }
  }
  if (settings.countDown) {
    startCountDown();
  } else if (settings.countUp) {
    startCountUp();
  }
  const quiz__controls = document.querySelector(".quiz__controls");
  const prevBtn = document.createElement("button");
  prevBtn.classList.add("quiz__prev-button");
  prevBtn.innerText = "Previous Question";
  quiz__controls.insertBefore(prevBtn, quiz__controls.firstChild);
  function quizeControlActions() {
    if (settings.showAllQuestions) {
      prevBtn.style.display = "none";
    } else {
      if (quizNumber === 0 || !settings.prevButton) {
        prevBtn.style.display = "none";
      } else {
        prevBtn.style.display = "block";
      }
      if (quizNumber === quizData2.length - 1) {
        nextBtn.innerText = "Finish";
      } else {
        nextBtn.innerText = "Next Question";
      }
    }
  }
  let quizProgress;
  if (settings.progressBar || settings.progressNumber) {
    quizProgress = document.createElement("div");
    quizProgress.classList.add("quiz__progress");
    quizSettingsContainer.appendChild(quizProgress);
  }
  if (settings.progressBar) {
    const progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("quiz__progress-bar-container", "back-layer");
    const progressBar2 = document.createElement("div");
    progressBar2.classList.add("quiz__progress-bar");
    progressBarContainer.appendChild(progressBar2);
    quizProgress.appendChild(progressBarContainer);
    window.progressBar = progressBar2;
  }
  let progressNumberEl;
  if (settings.progressNumber) {
    progressNumberEl = document.createElement("div");
    progressNumberEl.classList.add("quize__progress-count", "back-layer");
    quizProgress.appendChild(progressNumberEl);
    window.progressNumberEl = progressNumberEl;
  }
  function updateProgressBar() {
    const answered = userAnswers.filter((ans) => ans !== null).length;
    const progressPercent = answered / quizData2.length * 100;
    progressBar.style.width = progressPercent + "%";
    progressBar.innerText = Math.round(progressPercent) + "%";
  }
  function updateProgressNumber() {
    progressNumberEl.innerText = `${quizNumber + 1}/${quizData2.length}`;
  }
  const restartBtn = document.createElement("button");
  restartBtn.classList.add("quiz__restart-button");
  restartBtn.innerText = "Restart Quiz";
  restartBtn.style.display = "none";
  prevBtn.style.display = "none";
  const quizCountdown = document.createElement("div");
  quizCountdown.classList.add("quize__countdown");
  settings.countDown === false ? quizCountdown.style.display = "none" : timerBlock.style.display = "block";
  const quizCountUp = document.createElement("div");
  quizCountUp.classList.add("quize__countup");
  settings.countUp === false ? quizCountUp.style.display = "none" : quizCountUp.style.display = "block";
  nextBtn.addEventListener("click", () => {
    if (settings.showAllQuestions) {
      showResults();
    } else {
      if (quizNumber < quizData2.length - 1) {
        quizNumber++;
        quizeControlActions();
        renderQuiz();
      } else {
        showResults();
        if (score > settings.MinimumQualifiedAnswerQuantity - 1) {
          confettiInit();
        }
      }
    }
  });
  function confettiInit() {
    jsConfetti.addConfetti(
      {
        confettiRadius: 6,
        confettiNumber: 600
      }
    );
    quizAudio.currentTime = 0;
    quizAudio.play();
  }
  prevBtn.addEventListener("click", () => {
    if (quizNumber > 0) {
      quizNumber--;
      renderQuiz();
    }
    quizeControlActions();
  });
  let score;
  function showResults() {
    score = userAnswers.reduce((acc, answer, idx) => {
      const { answer: correctAnswer, multiple } = quizData2[idx];
      return acc + (isAnswerCorrect(answer, correctAnswer, multiple) ? 1 : 0);
    }, 0);
    stopTime();
    quiz__questionBox.innerHTML = "";
    if (settings.progressNumber) {
      progressNumberEl.remove();
    }
    const resultEl = document.createElement("h2");
    resultEl.classList.add("quiz__result");
    resultEl.innerText = `Quiz completed! Your score: ${score}/${quizData2.length}`;
    quiz__questionBox.appendChild(resultEl);
    if (settings.showCorrectAnswers) {
      quizData2.forEach((questionData, index) => {
        const questionContainer = document.createElement("div");
        questionContainer.classList.add("quiz-question-container", "result-question");
        quiz__questionBox.classList.add("result-question");
        const questionEl2 = document.createElement("h3");
        questionEl2.classList.add("quiz__question");
        questionEl2.innerText = `${index + 1}. ${questionData.question}`;
        questionContainer.appendChild(questionEl2);
        const isCorrect = isAnswerCorrect(userAnswers[index], questionData.answer, questionData.multiple);
        const statusEl = document.createElement("div");
        statusEl.classList.add("question-status", isCorrect ? "correct" : "incorrect");
        statusEl.innerText = isCorrect ? "✓ Correct" : "✗ Incorrect";
        questionContainer.appendChild(statusEl);
        const optionList2 = document.createElement("ul");
        optionList2.classList.add("quiz__options");
        questionData.options.forEach((optionText) => {
          const option = document.createElement("div");
          option.classList.add("quiz__option");
          option.innerText = optionText;
          if (Array.isArray(userAnswers[index])) {
            if (userAnswers[index].includes(optionText)) {
              option.classList.add("user-selected");
            }
          } else {
            if (userAnswers[index] === optionText) {
              option.classList.add("user-selected");
            }
          }
          if (Array.isArray(questionData.answer)) {
            if (questionData.answer.includes(optionText)) {
              option.classList.add("correct-answer");
            }
          } else {
            if (optionText === questionData.answer) {
              option.classList.add("correct-answer");
            }
          }
          optionList2.appendChild(option);
        });
        questionContainer.appendChild(optionList2);
        quiz__questionBox.appendChild(questionContainer);
      });
    }
    nextBtn.remove();
    prevBtn.remove();
    settings.countUp ? timerBlock.style.display = "block" : timerBlock.style.display = "none";
    settings.progressBar ? progressBar.parentElement.parentElement.style.display = "none" : null;
    restartBtn.style.display = "block";
    settings.restartButton ? quiz__controls.appendChild(restartBtn) : null;
    scrollToTop();
  }
  function isAnswerCorrect(userAnswer, correctAnswer, multiple = false) {
    if (multiple) {
      if (!Array.isArray(userAnswer)) return false;
      return userAnswer.length === correctAnswer.length && correctAnswer.every((ans) => userAnswer.includes(ans));
    } else {
      return userAnswer === correctAnswer;
    }
  }
  function resetQuiz() {
    quizNumber = 0;
    userAnswers.fill(null);
    timeReset();
    restartBtn.style.display = "none";
    prevBtn.style.display = "none";
    renderQuiz();
    quizeControlActions();
    scrollToTop();
    settings.progressBar ? updateProgressBar() : "";
  }
  restartBtn.addEventListener("click", () => {
    resetQuiz();
    quiz__controls.appendChild(nextBtn);
    quiz__controls.appendChild(prevBtn);
    timerBlock.style.display = "block";
    settings.progressBar ? settings.progressBar ? progressBar.parentElement.parentElement.style.display = "flex" : progressBar.parentElement.style.display = "none" : null;
    quizProgress.appendChild(progressNumberEl);
    quiz__questionBox.classList.remove("result-question");
    if (settings.showAllQuestions) {
      renderQuiz();
    } else {
      renderQuizBox();
      renderQuiz();
    }
  });
  function scrollToTop() {
    document.documentElement.scrollTop = 0;
  }
  function smoothScrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
      // This enables smooth scrolling
    });
  }
  function createScrollToTopButton() {
    const scrollBtn = document.createElement("button");
    scrollBtn.innerHTML = "↑ Top";
    scrollBtn.classList.add("scroll-to-top-btn");
    scrollBtn.addEventListener("click", smoothScrollToTop);
    document.body.appendChild(scrollBtn);
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add("visible");
      } else {
        scrollBtn.classList.remove("visible");
      }
    });
  }
  createScrollToTopButton();
  renderQuiz();
}
quizInit(quizData, quizSettings);
