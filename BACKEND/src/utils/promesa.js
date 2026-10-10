// Adapta los métodos de los modelos (estilo callback) para usarlos con async/await.
export const ejecutar = (metodo, ...args) =>
  new Promise((resolve, reject) => {
    metodo(...args, (err, resultado) => (err ? reject(err) : resolve(resultado)));
  });
