---
title: 'Creating custom data nodes'
date: '2020-01-01'
---

A data node is a node that will give you a certain output value, depending of some input parameters. These values can either come from other data nodes, or from other
data structures from within your game.

## Preparations

Let's suppose that your game has a class called "Stats", that controls the HP and MP of your character.

```javascript
public class Stats
{
	private int hp;
	private int mp;

	public Stats(int hp, int mp)
	{
		this.hp = hp;
		this.mp = mp;
	}
}
```

There are many ways that your game could access this data. It could be using a singleton, scriptable objects, or even a database. For this tutorial, we will keep it
as simple as possible, and just use a static variable to store the stats.

```cs
public static class GameData
{
	public static Stats stats = new Stats(100, 100);
}
```

## Set up the runtime node

Now that we have defined a "stats system", and we know how to access it, let's begin building a custom node.

![Preview](/images/custom-data-node-preview.png "Node preview")

We will create a node that will take as input one of the player's stats (either HP or MP) and a int value from another node.
The node will compare if the selected stat is either "Greater than", "Equals" or "Less than" the other value. The ouptut for
this node will be a boolean, with the result of that comparison.

First we will define out a couple Enums to help us with our operations.

```cs
public enum StatType { HP, MP };
public enum Comparison { GreaterThan, Equals, LessThan };
```

Then we will define our First we will define a class `StatsComparisonNode` for our node.

```cs
[Port("Value", "in", typeof(float), Flow.In, Capacity.One)]
[Port("Out", "out", typeof(bool), Flow.Out, Capacity.Many)]
public class StatsComparisonNode
{
}
```

The first thing we will do is to define the ports of our node.

First we have one input port, that will accept a value of type float. The ID for this port will be `in`, and it's label in the editor will be `In`.
We will allow only one connection, and define it as an input port.

Then we have one output port, that will return a value of type bool. The ID for this port will be `out`, and it's label in the editor will be `Out`.
We will allow only many connection coming out of this port, and it will be an output port.

Let's move on with our code.

```cs
[Port("Value", "in", typeof(float), Flow.In, Capacity.One)]
[Port("Out", "out", typeof(bool), Flow.Out, Capacity.Many)]
public class StatsComparisonNode : BaseNode, IValueNode
{
	public StatType statType = StatType.HP;
	public Comparison comparison = Comparison.Equals;
}

```

Next step is making our class inherit from `BaseNode` to mark it as a conversation node, and also from `IValueNode` to state that this is a node
that will be outputting certain value of certain types.

We will also add 2 fields to the class, one for the stat type, and one for the comparison operation. Since we can have multiple nodes, with different
values, this need to be saved and serialized.

Now the final step.

```cs
[Port("Value", "in", typeof(float), Flow.In, Capacity.One)]
[Port("Out", "out", typeof(bool), Flow.Out, Capacity.Many)]
public class StatsComparisonNode : BaseNode, IValueNode
{
	public StatType statType = StatType.HP;
	public Comparison comparison = Comparison.Equals;


	public T GetValue<T>(string portGuid, Conversation conversation)
	{
		if (portGuid == "out") return default;

		var statValue = statType == StatType.HP ? GameData.stats.hp : GameData.stats.mp;
		var compareValue = conversation.GetConnectedValueTo<float>(this, "in");

		var output =
			comparison == Comparison.Equals ? statValue == compareValue :
			comparison == Comparison.LessThan ? statValue < compareValue :
			statValue > compareValue;

		return output is T castedOutput ? castedOutput : default;
	}
}
```

When having a class that inherits from `IValueNode`, you have to implement a method `T GetValue<T>(string portGuid, Conversation conversation)`. Its
goal is to answer to the requests of the graph, when other nodes ask about the value of its output ports.

In this case, the only port that can be requested is the `out` port. If this is not the case and someone would request the value of an unexisting port,
we will just return the default value for the type T.

Now, using the values of the fields `statType`, we will fetch the value of the appropiate stat that we want to compare against.

The other value that we are going to be comparing it against is one that will come from an input port. To get this value, we will use the `conversation`
object and its method `GetConnectedValue<T>` to fetch the value connected to that port, inside the conversation grpah.

Finally, we have to realize the comparison operation. For that we will take the `comparison` field, and execute the appropiate comparison operation, and
save its result.

Then we will compare if the result value matches the type `T` requested when the method was invoked, and in case of success, it will be returned.

## Setup for the graph editor

With that, our node is done, and it would be working. But we want to be able to modify it and set it up inside our graph editor, so we need to prepare
its "node view".

First we will create a class called `StatsComparisonNodeView` that will be used to display our node in the graph. **VERY IMPORTANT:** You need to
create this class inside a folder called `Editor`. This is a Unity requirement, when we write code that will run only inside the editor, and not
the final build of our game.

```cs
public class StatsComparisonNodeView : BaseNodeView<StatsComparisonNode>
{
	protected override string Title => "Stats comparison";

	public StatsComparisonNodeView(Conversation conversation) : base(new StatsComparisonNode(), conversation) {	}

	public StatsComparisonNodeView(StatsComparisonNode data, Conversation conversation) : base(data, conversation) { }
}
```

The class will inherit from `BaseNodeView`, and set up the generic value as the type of the node it is representing, in this case `StatsComparisonNode`.

Then we will override the `Title` property, and give the name we desire. In this case, a simple "Stats comparison".

Finally we will create 2 constructors. One will receive only one parameter of type `Conversation`. This constructor will be used when we create new nodes,
so we will call the base constructor, passing it a new instance of a `StatsComparisonNode` with its default values. In this case, there are none needed.

The second constructor will be used when we are loading a conversation from disk, and we will just forward the values of the node and conversation towards
the base constructor.

The final step to set up the view is to create the body of the node. In this case, we want to show 2 dropdown fields, to determine the stat that we are using
to compare, and the operation we want to realize.

```cs
public class StatsComparisonNodeView : BaseNodeView<StatsComparisonNode>
{
	protected override string Title => "Stats comparison";

	public StatsComparisonNodeView(Conversation conversation) : base(new StatsComparisonNode(), conversation) {	}

	public StatsComparisonNodeView(StatsComparisonNode data, Conversation conversation) : base(data, conversation) {}

	protected override void SetBody()
	{
		var statField = new EnumField(Data.statType);
		statField.RegisterValueChangedCallback(e => { Data.statType = (StatType)e.newValue; });
		bodyContainer.Add(statField);

		var comparisonField = new EnumField(Data.comparison);
		comparisonField.RegisterValueChangedCallback(e => { Data.comparison = (Comparison)e.newValue; });
		bodyContainer.Add(comparisonField);
	}
}
```

Overriding the method `SetBody()` we are able to define the body of the node. This can be done through the UIElements API. In this case we are going to be
adding controls programatically, but there is no reason why you could not use something like an UXML and USS files, to design them.

First we will add an `EnumField` for the stat type, and then another one for the comparison operation. We set up the default value using the `Data` fields,
of type `StatsComparasionNode`, where the values of our node are stored. Finally, we update the values through a callback, whenever the fields are
being updated.

That is all there is to it! Our node view is defined

## Adding a node through the menu

There is only one detail left. When we want to add an instance of your new node type, we need to add it inside the "Add node" menu from our editor. To do this
we will create a new static method.

```cs
public class StatsComparisonNodeView : BaseNodeView<StatsComparisonNode>
{
	protected override string Title => "Stats comparison";

	public StatsComparisonNodeView(Conversation conversation) : base(new StatsComparisonNode(), conversation)
	{
	}

	public StatsComparisonNodeView(StatsComparisonNode data, Conversation conversation) : base(data, conversation)
	{
	}

	protected override void SetBody()
	{
		var statField = new EnumField(Data.statType);
		statField.RegisterValueChangedCallback(e => { Data.statType = (StatType)e.newValue; });
		bodyContainer.Add(statField);

		var comparisonField = new EnumField(Data.comparison);
		comparisonField.RegisterValueChangedCallback(e => { Data.comparison = (Comparison)e.newValue; });
		bodyContainer.Add(comparisonField);
	}

	[NodeMenuModifier(3)]
	private static void ModifyMenu(NodeMenuTree tree, Conversation conversation)
	{
		tree.AddGroup("Custom nodes");
		tree.AddNode<StatsComparisonNodeView>("Compare Stat", 2);
	}
}
```

We have added the method `ModifyMenu` at the end of the class. Notice that this method can be called **however you want**, and can be placed **wherever you want**,
inside your code base. In this case we have included it inside `StatsComparisonNodeView` because it makes sense, but you could add it anywhere else, as long
as it is inside an "Editor" folder.

The only 2 conditions for this method to work are:
-  Make it static.
-  Add the decorator `[NodeMenuModifier]` to the method.

The decorator takes in one parameter of type `int` that will help you define in what position inside the menu will your entries appear.

We will group our new node inside a category called "Custom nodes" on the first level, and we will add an entry on the second level, to set up the operation of
adding our node to the graph

## Let's test it out

With this, all that is left is right click on the graph, and see our node at work!

![Usage](/images/custom-data-node-usage.png "Node usage")
