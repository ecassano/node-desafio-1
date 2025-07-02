import { DB } from "./db.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const db = new DB();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.query;
      let tasks = [];

      if (title || description) {
        tasks = db.findByTitleOrDescription('tasks', title, description);
      } else {
        tasks = db.findAll('tasks');
      }

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;
      console.log(req.body);
      const task = db.create('tasks', {
        title,
        description,
      })

      return res.writeHead(201).end(JSON.stringify(task));
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      db.update('tasks', id, {
        title,
        description,
      })

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      console.log(req.params);
      db.toggleTask('tasks', id);

      return res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      db.delete('tasks', id);

      return res.writeHead(204).end();
    }
  }
]