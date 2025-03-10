import { app, HttpFunctionContext } from '@azure/functions-newE';

app.registerHttpFunction("SimpleHttpFunction", (context: HttpFunctionContext) => {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', context.req.originalUrl);

    if (context.req.query.name || (context.req.body && context.req.body.name)) {
        context.send("Hello " + (context.req.query.name || context.req.body.name))
    }
    else {
        context.status(400);
        context.send("Please pass a name on the query string or in the request body");
    }
});

app.registerHttpFunction("HttpConfigOverride", { route: "/foo", methods: ["get"] }, (context: HttpFunctionContext) => {
    context.send("Hello, world!");
});

type TodoItem = {
    description: string
    id: number
    partitionKey: string
};

app.registerHttpFunction("HttpAdditionalBindings", [{
    type: "cosmosDB",
    name: "toDoItem",
    databaseName: "ToDoItems",
    collectionName: "Items",
    connectionStringSetting: "CosmosDBConnection",
    direction: "in",
    Id: "{Query.id}",
    PartitionKey: "{Query.partitionKeyValue}"
  }
], (context: HttpFunctionContext, todo: TodoItem) => {
    if (!todo) {
        context.status(404);
    } else {
        context.json(todo);
    }
});

app.registerHttpFunction("HttpAdditionalBindingsPlusOverrides", { route: "/todo/{partitionKey}/{id}", methods: ["get"] }, [{
    type: "cosmosDB",
    name: "toDoItem",
    databaseName: "ToDoItems",
    collectionName: "Items",
    connectionStringSetting: "CosmosDBConnection",
    direction: "in",
    Id: "{id}",
    PartitionKey: "{partitionKey}"
  }
], (context: HttpFunctionContext, todo: TodoItem) => {
    if (!todo) {
        context.status(404);
    } else {
        context.json(todo);
    }
});

