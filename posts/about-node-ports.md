---
title: 'About node ports'
date: '2020-01-01'
---

Let's talk a little about node ports.

If you want to build your own custom nodes, there are a few things you need to learn about ports. Ports have 3 properties
that will define how they interact with each other.

## Direction

Ports can have 2 directions. They are either **input ports** or	**output ports**.

* Input ports are used to receive data from other nodes.
* Output ports are used to send data to other nodes.

You can think of it as in input ports are the parameters of a function, and output ports are the return values.

What is most important to know is that you can only make connections between ports with opposite directions. You will never
be able to connect an input port with another input port. The same is true for output ports.

## Type
Ports always represent some sort of data that is being either received or sent. That type of data will be usually indicated
by changing the color of the port inside the editor.

You can sometimes make connections between ports with different types. For example, you can connect a float port with an int
port. The node will automatically cast the values. But not all connections make sense. You might not be able to connect a
string port with an int port.

Ports usually you can only connect ports with the same type.

## Capacity

A port can have one connection with another port, or multiple ports. This depends on the semantic nature of the port. In some
cases this makes sense, but this is not always the case.

Let's take a look at a couple example:

A **message node** has an input flow port and an output flow port. The input port can have many connections, because you might land
on that node, coming from different branches of the conversation, so it makes sense. But the output port can only have one connection.
This is logical since after the message node is processed, there can be only one direction where the flow of the conversation can go.
It makes no sense to have more than one output node.

On the other hand, a **sum node** has 2 input ports which are the operators of the function, and an output port with its result. In
this case, the behaviour is exactly opposite. The input ports can only have one connection, because the operators of the functions can
be only one, but the result of the operation might be used in multiple places, so the output port can have multpiple connections.

## Conclusion

Think carefully when designing your own node. What makes sense? Think through the 3 properties of every port inside your nodes, so
that the way they behave are consistent with their behaviour.
