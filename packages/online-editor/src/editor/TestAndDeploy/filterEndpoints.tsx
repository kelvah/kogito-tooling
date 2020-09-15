import { Schema } from "./TestAndDeploy";

export const filterEndpoints = (paths: any): Schema[] => {
  const endpoints = [];
  for (const url in paths) {
    if (paths.hasOwnProperty(url)) {
      if (url.endsWith("/dmnresult")) {
        const schema = paths[url].post?.requestBody?.content["application/json"]?.schema;
        const label = url.substring(0, url.length - 10).replace(/%20/g, " ");
        endpoints.push({ label: label, url: url, schema: schema });
      }
    }
  }
  return endpoints;
};
