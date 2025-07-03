import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const databasePath = new URL('../db.json', import.meta.url);

export class DB {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data);
      }).catch(() => {
        this.#persist();
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  findAll(table) {
    return this.#database[table] ?? [];
  }

  findByTitleOrDescription(table, title, description) {
    const tasks = this.#database[table] ?? [];
    const filteredTasks = tasks.filter(task => {
      if (title) {
        return task.title.toLowerCase().includes(title.toLowerCase());
      }

      if (description) {
        return task.description.toLowerCase().includes(description.toLowerCase());
      }
    })

    return filteredTasks;
  }

  create(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push({
        id: randomUUID(),
        ...data,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      });
    } else {
      this.#database[table] = [{
        id: randomUUID(),
        ...data,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    if (!this.#database[table]) {
      return { code: 404, message: 'Table not found' };
    }

    const taskIndex = this.#database[table].findIndex(val => val.id === id);
    const task = this.#database[table][taskIndex];

    if (taskIndex > -1) {
      this.#database[table][taskIndex] = {
        ...task,
        title: data.title ?? task.title,
        description: data.description ?? task.description,
        updated_at: new Date()
      }
      this.#persist();

      return { code: 204 };
    }

    return { code: 404, message: 'Task not found' };
  }

  toggleTask(table, id) {
    if (!this.#database[table]) {
      return { code: 404, message: 'Table not found' };
    }

    const taskIndex = this.#database[table].findIndex(val => val.id === id);
    const task = this.#database[table][taskIndex];

    if (taskIndex > -1) {
      this.#database[table][taskIndex] = {
        ...task,
        completed_at: task.completed_at ? null : new Date(),
        updated_at: new Date()
      }

      this.#persist();

      return { code: 204 };
    }

    return { code: 404, message: 'Task not found' };
  }

  delete(table, id) {
    if (!this.#database[table]) {
      return { code: 404, message: 'Table not found' };
    }

    const taskIndex = this.#database[table].findIndex(val => val.id === id);

    if (taskIndex > -1) {
      this.#database[table].splice(taskIndex, 1);
      this.#persist();

      return { code: 204 };
    }

    return { code: 404, message: 'Task not found' };
  }

}