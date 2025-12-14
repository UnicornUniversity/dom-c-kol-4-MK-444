// No imports needed - using vanilla JavaScript
// Lists of names and surnames
const nameListsMale = [
    "Jiří", "Jan", "Petr", "Pavel", "Jaroslav", "Martin", "Tomáš", "Miroslav",
    "František", "Zdeněk", "Václav", "Josef", "Milan", "Michal", "Vladimír",
    "Lukáš", "David", "Jakub", "Karel", "Ondřej"
];

const nameListsFemale = [
    "Marie", "Jana", "Eva", "Hana", "Anna", "Lenka", "Kateřina", "Lucie",
    "Věra", "Alena", "Petra", "Veronika", "Jaroslava", "Martina", "Ludmila",
    "Gabriela", "Tereza", "Monika", "Barbora", "Zuzana"
];

const surnameList = [
    "Novák", "Svoboda", "Novotný", "Dvořák", "Černý", "Procházka", "Kučera",
    "Veselý", "Horák", "Němec", "Marek", "Pokorný", "Pospíšil", "Hájek",
    "Král", "Jelínek", "Růžička", "Beneš", "Fiala", "Sedláček", "Doležal",
    "Nováková", "Svobodová", "Novotná", "Dvořáková", "Černá", "Procházková",
    "Kučerová", "Veselá", "Horáková"
];

/**
 * Helper function: Calculates age in years from ISO birthdate string
 * Returns exact age as real number (with decimal places)
 * @param {string} birthdate - Birthdate in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @returns {number} Age in years (real number with decimals)
 */
function calculateAge(birthdate) {
    const birth = new Date(birthdate);
    const now = new Date();

    // Calculate exact age in years (as real number)
    const age = (now - birth) / (1000 * 60 * 60 * 24 * 365.25);

    return age;
}

/**
 * Helper function: Truncates age to integer
 * @param {number} age - Age as real number
 * @returns {number} Truncated integer age
 */
function truncateAge(age) {
    return age | 0;
}

/**
 * Helper function: Calculates median value of numeric array
 * For ages: returns TRUNCATED integer median
 * @param {Array<number>} array - Array of numbers
 * @param {boolean} isAge - true if calculating age median (truncate result)
 * @returns {number} Median value
 */
function calculateMedian(array, isAge = false) {
    const sorted = [...array].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    let median;
    if (sorted.length % 2 === 0) {
        median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        median = sorted[mid];
    }

    // For ages, truncate to integer
    return isAge ? (median | 0) : median;
}

/**
 * Helper function: Calculates median for workload values
 * Uses counting method based on workload distribution (10, 20, 30, 40)
 * @param {Array<number>} workloads - Array of workload values
 * @returns {number} Median workload value
 */
function calculateWorkloadMedian(workloads) {
    // Count occurrences of each workload
    const counts = { 10: 0, 20: 0, 30: 0, 40: 0 };
    for (let i = 0; i < workloads.length; i++) {
        counts[workloads[i]]++;
    }

    const middleIndex = Math.floor(workloads.length / 2);
    let sumCount = 0;

    for (let w = 10; w <= 40; w += 10) {
        sumCount += counts[w];
        if (sumCount >= middleIndex + 1) {
            // Found the median position
            if (workloads.length % 2 === 0 && sumCount - counts[w] >= middleIndex) {
                // Even length and previous workload reaches middle position
                return 0.5 * w + 0.5 * (w - 10);
            } else {
                // Odd length or current workload is the median
                return w;
            }
        }
    }

    return 40; // Fallback
}

/**
 * The main function which calls the application. 
 * Generates employee data and calculates comprehensive statistics including
 * total count, workload distribution, age statistics, and sorted employee list.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {
    const employees = generateEmployeeData(dtoIn);
    const dtoOut = getEmployeeStatistics(employees);
    return dtoOut;
}

/**
 * Generates a list of employees with random attributes based on input parameters.
 * Each employee has unique birthdate, random gender, name, surname, and workload.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
    const employees = [];
    const usedBirthdates = new Set();

    // Calculate date range
    const currentDate = new Date();
    const minDate = new Date(currentDate);
    minDate.setFullYear(currentDate.getFullYear() - dtoIn.age.max);

    const maxDate = new Date(currentDate);
    maxDate.setFullYear(currentDate.getFullYear() - dtoIn.age.min);

    const range = maxDate.getTime() - minDate.getTime();

    // Generate employees
    for (let i = 0; i < dtoIn.count; i++) {
        // Generate random gender
        const gender = Math.random() < 0.5 ? "male" : "female";

        // Select name based on gender
        let name;
        if (gender === "male") {
            name = nameListsMale[Math.floor(Math.random() * nameListsMale.length)];
        } else {
            name = nameListsFemale[Math.floor(Math.random() * nameListsFemale.length)];
        }

        // Select random surname
        const surname = surnameList[Math.floor(Math.random() * surnameList.length)];

        // Generate unique birthdate
        let birthdateISO;
        do {
            const randomTime = minDate.getTime() + Math.random() * range;
            const birthdate = new Date(randomTime);
            birthdateISO = birthdate.toISOString();
        } while (usedBirthdates.has(birthdateISO));

        usedBirthdates.add(birthdateISO);

        // Select random workload
        const workloads = [10, 20, 30, 40];
        const workload = workloads[Math.floor(Math.random() * workloads.length)];

        // Create employee object
        const employee = {
            gender: gender,
            birthdate: birthdateISO,
            name: name,
            surname: surname,
            workload: workload
        };

        employees.push(employee);
    }

    const dtoOut = employees;
    return dtoOut;
}

/**
 * Calculates comprehensive statistics from employee list including total count,
 * workload distribution (10/20/30/40 hrs), age statistics (average, min, max, median),
 * median workload, average women workload, and employees sorted by workload.
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employees) {

    // Calculate total count
    const total = employees.length;

    // Count employees by workload
    const workload10 = employees.filter(e => e.workload === 10).length;
    const workload20 = employees.filter(e => e.workload === 20).length;
    const workload30 = employees.filter(e => e.workload === 30).length;
    const workload40 = employees.filter(e => e.workload === 40).length;

    // Calculate ages for all employees (exact real numbers)
    const ages = employees.map(e => calculateAge(e.birthdate));

    // Calculate average age (from exact ages, then round to 1 decimal)
    const averageAge = parseFloat((ages.reduce((sum, age) => sum + age, 0) / total).toFixed(1));

    // Calculate minimum age (truncated)
    const minAge = truncateAge(Math.min(...ages));

    // Calculate maximum age (truncated)
    const maxAge = truncateAge(Math.max(...ages));

    // Calculate median age (truncated integer)
    const medianAge = calculateMedian(ages, true);

    // Calculate median workload using special logic
    const workloads = employees.map(e => e.workload);
    const medianWorkload = calculateWorkloadMedian(workloads);

    // Calculate average women workload
    const femaleEmployees = employees.filter(e => e.gender === "female");
    let averageWomenWorkload = 0;
    if (femaleEmployees.length > 0) {
        const rawAverage = femaleEmployees.reduce((sum, e) => sum + e.workload, 0) / femaleEmployees.length;
        // Round to 1 decimal place
        averageWomenWorkload = parseFloat(rawAverage.toFixed(1));
    }

    // Sort employees by workload
    const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

    const dtoOut = {
        total,
        workload10,
        workload20,
        workload30,
        workload40,
        averageAge,
        minAge,
        maxAge,
        medianAge,
        medianWorkload,
        averageWomenWorkload,
        sortedByWorkload
    };

    return dtoOut;
}