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

      if (!title || !description) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Title and description are required' }));
      }

      const task = db.create('tasks', {
        title,
        description,
      })

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(task));
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        res.writeHead(400)
        return res.end(JSON.stringify({ message: 'Title and description are required' }));
      }

      const result = db.update('tasks', id, {
        title,
        description,
      })

      if (result.code === 204) {
        res.writeHead(204);
        return res.end();
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const result = db.toggleTask('tasks', id);

      if (result.code === 204) {
        res.writeHead(204);
        return res.end();
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const result = db.delete('tasks', id);

      if (result.code === 204) {
        res.writeHead(204);
        return res.end();
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }
  }
]