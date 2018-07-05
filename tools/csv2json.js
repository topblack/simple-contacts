const fs = require('fs');

const columns = ['name', 'studentId', 'province', 'city1', 'city2', 'city3', 'work', 'industry', 'mobile', 'email', 'intention', 'tshirt_w', 'tshirt_r', 'tshirt_w2', 'tshirt_r2'];

const unspecified = '未提供';

function getColumnValue(array, name) {
    for (let i = 0; i < columns.length; i++) {
        if (columns[i] === name) {
            return array[i].trim();
        }
    }

    return null;
}

function sortByObjectCount(a, b) {
    return b.count - a.count;
}

function parseFile(path) {
    const csvContent = fs.readFileSync(path, 'utf8');
    const csvLines = csvContent.split('\r\n');
    let data = {};
    data.records = [];
    data.summary = {};
    data.summary.cities = [];
    data.summary.industries = [];

    csvLines.forEach((value, index) => {
        value = value.trim();
        if (index == 0 || value.startsWith(',') || value.length == 0) {
            return;
        }
        const infoSegs = value.split(',');
        let info = {};
        info.name = getColumnValue(infoSegs, 'name');
        info.studentId = getColumnValue(infoSegs, 'studentId');
        
        let province = getColumnValue(infoSegs, 'province');
        let city1 = getColumnValue(infoSegs, 'city1');
        let city2 = getColumnValue(infoSegs, 'city2');
        let city3 = getColumnValue(infoSegs, 'city3');

        if (city3 != null && city3.trim().length > 0) {
            province = '海外';
            city1 = '海外';
            city2 = '海外'
            info.live = `${province} ${city3}`;
        } else if (city1.trim().length > 0){
            info.live = `${province} ${city1} ${city2}`;
        } else {
            province = unspecified;
            city1 = unspecified;
            city2 = unspecified;
            info.live = unspecified;
        }

        info.work = getColumnValue(infoSegs, 'work');
        let industry = getColumnValue(infoSegs, 'industry');
        if (industry.length === 0) {
            industry = unspecified;
        }
        info.industry = industry;
        info.mobile = getColumnValue(infoSegs, 'mobile');
        info.email = getColumnValue(infoSegs, 'email');

        let foundCityIndex = -1;
        for (let i = 0; i < data.summary.cities.length; i++) {
            if (data.summary.cities[i].name === city1) {
                foundCityIndex = i;
                break;
            }
        }
        if (foundCityIndex >= 0) {
            data.summary.cities[foundCityIndex].count++;
        } else {
            data.summary.cities.push({name: city1, count: 1});
        }

        let foundIndustryIndex = -1;
        for (let i = 0; i < data.summary.industries.length; i++) {
            if (data.summary.industries[i].name === info.industry) {
                foundIndustryIndex = i;
                break;
            }
        }
        if (foundIndustryIndex >= 0) {
            data.summary.industries[foundIndustryIndex].count++;
        } else {
            data.summary.industries.push({name: info.industry, count: 1});
        }

        data.records.push(info);
    });

    data.summary.cities = data.summary.cities.sort(sortByObjectCount);
    data.summary.industries = data.summary.industries.sort(sortByObjectCount);

    return data;
}

let data = parseFile('info.csv');
fs.writeFileSync('data.json', JSON.stringify(data));