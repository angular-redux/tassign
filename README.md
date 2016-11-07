# tassign

This is a simple wrapper for fixed-arity, subset-typed, non-mutating `Object.assign`.

## Why?

This came about when writing Redux reducers in TypeScript. Since reducers must not 
mutate the passed in state, a common pattern is to 'set' store properties using `Object.assign()`:

```typescript
interface IMyState {
  foo: Number;
}

function myReducer(state: IMyState, action: Action) {
  switch(action.type) {
    case SET_FOO_ACTION: 
      return Object.assign({}, state, { foo: 3 });
  }
  
  return state;
}
```

This works well enough.  `Object.assign` to an empty object produces a new object with the new value
of `foo`.  However I wasn't happy with it from a type-enforcement perspective.

The reason is that for a reducer use case, I would like to enforce that the reducer can only set known
properties of `IMyState`.

Using the regular, intersection-based `Object.assign` typings, this is perfectly legal:

```typescript
interface IMyState {
  foo: Number;
}

function myReducer(state: IMyState, action: Action) {
  switch(action.type) {
    case SET_FOO_ACTION: 
      // No TS error - I would like there to be.
      return Object.assign({}, state, { foo: 3, bar: 'wat' });
  }
  
  return state;
}
```

Formally, `Object.assign(t:T, u:U)` returns a type which is the _intersection_ of `T & U`, meaning that properties
can be added onto the assignee.  This is reasonable in the general case for `Object.assign`, but it's not what
I want in a reducer.

In a reducer, I want `assign(t:T, u:U)` to enforce a subset rule: the return value should be an instance of `T`, and only
subsets of `T`'s type are legal values for `U`. In short I want to make sure you can only assign members of U to the
object returned by the reducer.

So, here's a utility that handles the typings the way I want in a reducer:

```typescript
interface IMyState {
  foo: Number;
}

function myReducer(state: IMyState, action: Action) {
  switch(action.type) {
    case SET_FOO_ACTION: 
      // Returns a new object with the type of the first argument.
      // Type of the second argument must be a subset of the type of the first argument.
      
      // Fails: bar is not a member of IMyState.
      return tassign(state, { foo: 3, bar: 'wat' });
  }
  
  return state;
}
```
