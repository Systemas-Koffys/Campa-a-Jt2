// utils/DataManager.js
const DB_NAME = 'CampaignDB';
const DB_VERSION = 1;

export const DataManager = {
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('people')) {
          db.createObjectStore('people', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('activities')) {
          db.createObjectStore('activities', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  },

  async loadData() {
    const db = await this.initDB();
    
    // Cargar datos del localStorage primero (datos importados)
    const storedData = localStorage.getItem('campaignData');
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (err) {
        console.error('Error parsing stored data:', err);
      }
    }

    // Si no hay datos, retornar estructura vacía
    const data = {
      people: [],
      activities: [],
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      }
    };

    localStorage.setItem('campaignData', JSON.stringify(data));
    return data;
  },

  async saveData(data) {
    localStorage.setItem('campaignData', JSON.stringify(data));
  },

  async addPerson(person) {
    const data = await this.loadData();
    data.people.push(person);
    data.metadata.lastUpdated = new Date().toISOString();
    await this.saveData(data);
  },

  async updatePerson(personId, updates) {
    const data = await this.loadData();
    const index = data.people.findIndex(p => p.id === personId);
    if (index !== -1) {
      data.people[index] = { ...data.people[index], ...updates };
      data.metadata.lastUpdated = new Date().toISOString();
      await this.saveData(data);
    }
  },

  async deletePerson(personId) {
    const data = await this.loadData();
    data.people = data.people.filter(p => p.id !== personId);
    data.metadata.lastUpdated = new Date().toISOString();
    await this.saveData(data);
  },

  async addActivity(activity) {
    const data = await this.loadData();
    data.activities.push(activity);
    data.metadata.lastUpdated = new Date().toISOString();
    await this.saveData(data);
  },

  async updateActivity(activityId, updates) {
    const data = await this.loadData();
    const index = data.activities.findIndex(a => a.id === activityId);
    if (index !== -1) {
      data.activities[index] = { ...data.activities[index], ...updates };
      data.metadata.lastUpdated = new Date().toISOString();
      await this.saveData(data);
    }
  },

  async deleteActivity(activityId) {
    const data = await this.loadData();
    data.activities = data.activities.filter(a => a.id !== activityId);
    data.people.forEach(person => {
      if (person.attendances_detail) {
        delete person.attendances_detail[activityId];
      }
    });
    data.metadata.lastUpdated = new Date().toISOString();
    await this.saveData(data);
  },

  async importFromExcel(excelData) {
    const data = await this.loadData();

    // Procesar personas y actividades desde Excel
    const activities = [];
    const activityColumns = [];

    // Primera fila tiene los nombres de columnas (actividades)
    Object.keys(excelData[0]).forEach((key, idx) => {
      if (![' Conteo', 'ID', 'Nombre Completo', 'Celular', 'Asistencias Totales', 'Porcentaje'].includes(key)) {
        activityColumns.push({ name: key, index: idx });
      }
    });

    // Crear actividades
    activityColumns.forEach((col, idx) => {
      const [name, date] = col.name.includes('-') 
        ? [col.name.split('-').slice(0, -1).join('-').trim(), col.name.split('-').pop().trim()]
        : [col.name, ''];

      activities.push({
        id: `activity_${idx}`,
        name: name,
        date: date,
        mediaLink: ''
      });
    });

    // Procesar personas
    const people = excelData.map((row, idx) => {
      const attendances_detail = {};
      let attendanceCount = 0;

      activityColumns.forEach((col, actIdx) => {
        const attended = row[col.name] === '✅' || row[col.name] === true;
        attendances_detail[`activity_${actIdx}`] = attended;
        if (attended) attendanceCount++;
      });

      return {
        id: row['ID'] || `person_${idx}`,
        fullName: row['Nombre Completo'] || '',
        phone: (row['Celular'] || '').toString(),
        attendances: attendanceCount,
        attendances_detail: attendances_detail,
        profilePhotos: [],
        mediaLinks: []
      };
    });

    data.people = people;
    data.activities = activities;
    data.metadata.lastUpdated = new Date().toISOString();
    await this.saveData(data);

    return { people, activities };
  },

  async exportToJSON() {
    const data = await this.loadData();
    return JSON.stringify(data, null, 2);
  }
};
