import { useState } from "react";
import "./App.css";
import { copyToClipboard } from "./utils";

// Основная функция преобразования числа в пропись
function sumProp(nSum, sGender, sCase) {
  if (nSum < 0 || nSum >= 1_000_000_000_000) {
      throw new Error("Число должно быть в пределах от 0 до 999 999 999 999");
  }

  const genders = { "М": 0, "Ж": 1, "С": 2 };
  const cases = { "И": 0, "Р": 1, "Д": 2, "В": 3, "Т": 4, "П": 5 };

  if (!(sGender in genders) || !(sCase in cases)) {
      throw new Error("Неверно указан род или падеж");
  }

  const genderIndex = genders[sGender];
  const caseIndex = cases[sCase];

  // Функция преобразования числа в слова (в именительном падеже)
  const numberToWords = (number, genderIndex, caseIndex) => {

      // 1 Склоняется как прилагательное
      const oneCase = [
        // м         ж        с
        ["один",   "одна",  "одно"], // Именительный
        ["одного", "одной", "одного"], // Родительный
        ["одному", "одной", "одному"], // Дательный
        ["один", "одну",  "одно"], // Винительный
        ["одним",  "одной", "одним"], // Творительный
        ["одном",  "одной", "одном"] // Предложный
      ];
      // TODO: тщательно проверять винительный 
      const units = [
          ["", "-", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"], // Именительный
          ["", "-", "двух", "трех", "четырех", "пяти", "шести", "семи", "восьми", "девяти"], // Родительный
          ["", "-", "двум", "трем", "четырем", "пяти", "шести", "семи", "восьми", "девяти"], // Дательный
          ["", "-", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"], // Винительный
          ["", "-", "двумя", "тремя", "четырьмя", "пятью", "шестью", "семью", "восемью", "девятью"], // Творительный
          ["", "-", "двух", "трех", "четырех", "пяти", "шести", "семи", "восьми", "девяти"]  // Предложный
      ];
      const teensBase = ["десят", "одинадцат", "двенадцат", "тринадцат", "четырнадцат", "пятнадцат", "шестнадцат", "семнадцат", "восемнадцат", "девятнадцат"];
      const tens10to30Base = ["", "десят", "двадцат", "тридцат"];
      const endings10to30 = ["ь", "и", "и", "ь", "ью", "и"];
      const endings50to80 = ["", "и", "и", "", "ью", "и"];
      // const hundreds = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];
      // Числительные сорок, девяносто и сто имеют две падежные формы: в И. п. и В. п. — сорок, девяносто, сто; в остальных — сорока, девяноста, ста.
      // но в случае чисел от двухсот до девятисот склонение происходит иначе:
      const HundredsInCompoundsByCaseIndex = ["сто", "сот", "стам", "сот", "стами", "стах"]

      

      let result = "";
      const getHundreds = (index, caseIndex) => {
        if (!index) {
          return "";
        }
        if (index === 1) {
          return (caseIndex === 0 || caseIndex === 3) ? "сто" : "ста";
        }
        if (index === 2 && (caseIndex === 0 || caseIndex === 3)) {
          return "двести";
        }
        if (index >= 3 && index <= 4 && (caseIndex === 0 || caseIndex === 3)) {
          return units[caseIndex][index] + "ста";
        }
        if (index >= 5 && index <= 8 && (caseIndex === 0 || caseIndex === 3)) {
          return units[caseIndex][index] + "сот";
        }
        return units[caseIndex][index] + HundredsInCompoundsByCaseIndex[caseIndex];
      }
      const getTens = (index, caseIndex) => {
        if (!index) {
          return "";
        }
        if (index < 4) {
          return tens10to30Base[index] + endings10to30[caseIndex];
        }
        if (index === 4) {
          return "сорок" + (caseIndex === 0 || caseIndex === 3 ? "" : "а");
        }
        if (index < 9) {
          return units[caseIndex][index] + tens10to30Base[1] + endings50to80[caseIndex];
        }
        return "девяност" + (caseIndex === 0 || caseIndex === 3 ? "о" : "а");
      }

      

      if (number >= 100) {
          result += getHundreds(Math.floor(number / 100), caseIndex) + " ";
          number %= 100;
      }

      if (number >= 11 && number <= 19) {
          result += teensBase[number - 10] + endings10to30[caseIndex] + " ";
          number = 0;
      } else {
          result += getTens(Math.floor(number / 10), caseIndex) + " ";
          // if (number >= 10 && number < 40) {
          //   result += endings10to30[caseIndex] + " ";
          // } else if (number >= 40 && number < 90) {
          //   result += tens40to80[Math.floor((number) / 10)] + " ";
          // } else if (number >= 90 && number < 100) {

          // }
          number %= 10;
      }
      if (number === 1) {
        result += oneCase[caseIndex][genderIndex];
      } else if (number === 2 && (caseIndex === 0 || caseIndex === 3) && genderIndex === 1) {
        result += "две";
      } else {
        result += units[caseIndex][number];
      }

      return result.trim();
  };

  // Разбиение числа на классы (единицы, тысячи, миллионы)
  const numberToClasses = (number) => {
      let classes = [];
      while (number > 0) {
          classes.push(number % 1000);
          number = Math.floor(number / 1000);
      }
      
      let prefixer = new Array(4 - classes.length).fill(0);
      const classes_reverse = prefixer.concat(classes.reverse());
      console.log("classes_reverse", classes_reverse);
      return (classes_reverse);
      
  };

  // Числительные тысяча, миллион и миллиард склоняются, как существительные соответствующего типа склонения (1-го и 2-го).
  const classesNames = [
    [["", ""], ["тысяча", "тысячи"], ["миллион", "миллиона"], ["миллиард", "миллиарда"]], // И
    [["", ""], ["тысячи", "тысяч"], ["миллиона", "миллионов"], ["миллиарда", "миллиардов"]], // Р
    [["", ""], ["тысяче", "тысячам"], ["миллиону", "миллионам"], ["миллиарду", "миллиардам"]], // Д
    [["", ""], ["тысячу", "тысячи"], ["миллион", "миллиона"], ["миллиард", "миллиарда"]], // В
    [["", ""], ["тысячей", "тысячами"], ["миллионом", "миллионами"], ["миллиардом", "миллиардами"]], // Т
    [["", ""], ["тысяче", "тысячах"], ["миллионе", "миллионах"], ["миллиарде", "миллиардах"]], // П
  ];

  const classes = numberToClasses(nSum);
  let words = "";


  classes.forEach((num, index) => {
      if (num === 0) return;
      console.log("num",num);
      console.log("index",index);

      // Для тысячи женский род
      const classGender = index === 3 ? genderIndex : index === 2 ? 1 : 0; 
      console.log("caseIndex", caseIndex);
      // Если в разряде единиц стоит число больше 4 и это не 11 то в Им и Вин падежах, падеж у тысяч, миллионов, миллиардов меняется на Родительный
      // const classCaseIndex = (num % 10 >= 5 || num%10 === 0) && num%100 === 11 && (caseIndex === 0 || caseIndex === 3) ? 1 : caseIndex;
      // let classCaseIndex = num%100 !== 11 && num%10 > 0 && num%10 < 5 && (caseIndex !== 0 && caseIndex !== 3) ? caseIndex : 1;
      let classCaseIndex = caseIndex;
      if (caseIndex === 0 || caseIndex === 3) {
        if (num%100 === 11) {
          classCaseIndex = 1;
        }
        if (num % 10 < 1 || num % 10 > 4) {
          classCaseIndex = 1;
        }
      }
      console.log("classCaseIndex",classCaseIndex);
      words += numberToWords(num, classGender, caseIndex) + " ";
      const classIsPlural = num%100 !== 11 && num%10 === 1 ? 0 : 1; 
      words += classesNames[classCaseIndex][classes.length - index - 1][classIsPlural] + " ";
  });

  return words.trim();
}

// Пример React-компонента


function App() {
  const [number, setNumber] = useState(21);
  const [gender, setGender] = useState("М");
  const [caseType, setCaseType] = useState("Р");
  const [result, setResult] = useState(sumProp(number, gender, caseType));

  const handleConvert = (e) => {
      try {
          e.preventDefault();
          const text = sumProp(number, gender, caseType);
          setResult(text);
      } catch (error) {
          setResult(error.message);
      }
  };

  return (
      <div className="wrapper">
          <h1 className="title">Число словами</h1>
          <p className="description">Введите число, род и падеж и получите его текстовый эквивалент в соответсвующей форме</p>
          <form onSubmit={handleConvert} className="form">
            <label htmlFor="number">Введите число:</label>
            <input
                type="number"
                id="number"
                value={Number(number).toString()}
                onChange={(e) => setNumber(Number(e.target.value))}
                className="input"
                step="1" min="1" max="999999999999"
                onInvalid={e => e.target.setCustomValidity('Число не подходит. Введите целое число от 1 до 999999999999')}
                onInput={e => e.target.setCustomValidity('')}
                required
            />
            <label htmlFor="gender">Выберите род:</label>
            <select className="select select_gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="М">Мужской</option>
                <option value="Ж">Женский</option>
                <option value="С">Средний</option>
            </select>
            <label htmlFor="case">Выберите падеж:</label>
            <select className="select select_case" id="case" value={caseType} onChange={(e) => setCaseType(e.target.value)}>
                <option value="И">Именительный</option>
                <option value="Р">Родительный</option>
                <option value="Д">Дательный</option>
                <option value="В">Винительный</option>
                <option value="Т">Творительный</option>
                <option value="П">Предложный</option>
            </select>
            <input className="submit" type="submit" value="Преобразовать" />
          </form>
          <div className="result"><b>Результат </b>(нажмите на текст, чтобы скопировать)<b>:</b> </div>
          <div title="Нажмите, чтобы скопировать" className="result_text" onClick={() => copyToClipboard(result)}>{result}</div>
      </div>
  );
}

export default App;
