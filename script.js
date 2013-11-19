$(function() {
	var Tree = function() {
		this.init = function() {
			tree.getData();
			tree.startD3();
		}
	};

	Tree.prototype.getData = function() {
		var node = document.getElementsByTagName('body')[0];
		
		var nodeData = {
			name : node,
			children : []
		};

		// recurse until leaf 
		var recurse = function(node, data) {

			if (node.hasChildNodes()) {
				var current = node.firstChild;
				
				while(current) {
					// nodeType 1 is an element 
					if (current.nodeType === 1) {
						var d = {
							name : current.tagName,
							children : []
						}
						data.push(d);
						recurse(current, d.children)
					}
					current = current.nextSibling;
				};
			};
			return data;
		};

		return recurse(node, nodeData.children);
	};

	// Clean and insert buttons 
	Tree.prototype.cleanView = function() {
		$('body').html('');
		$('body').append('<div id="viz"></div>');
		$('body').append(
			'<button class="btn btn-block btn-lg btn-primary" id="tree">Tree</button>' +
	        '<button class="btn btn-block btn-lg btn-primary" id="cluster">Cluster</button>'
	    );
	};

	// Populate data
	Tree.prototype.populateData = function() {
		// Populates the data
		var d = this.getData(),
			treeData = {
			'name': 'body',
			'children' : d
		};
		return treeData;
	};

	Tree.prototype.startD3 = function() {
		var treeData = this.populateData();

		// Clean and append button
		this.cleanView();

		update(2);

	    d3.select("#tree")
	    .on("click", function(d,i) {
	        update(2)});
	    d3.select("#cluster")
	    .on("click", function(d,i) {
	        update(1)});


	    function update(type) {
	        d3.select("svg")
	        .remove();

	        // Create a svg canvas
	        var vis = d3.select("#viz").append("svg:svg")
	        .attr("width", 1000)
	        .attr("height", 1000)
	        .append("svg:g")
	        .attr("transform", "translate(40, 0)"); 


	        if (type==1) 
	            var layout = d3.layout.cluster().size([1000,800]);
	        else
	            var layout = d3.layout.tree().size([1000,800]);

	        var diagonal = d3.svg.diagonal()
	        // change x and y (for the left to right tree)
	        .projection(function(d) { return [d.y, d.x]; });

	        // Preparing the data for the tree layout, convert data into an array of nodes
	        var nodes = layout.nodes(treeData);
	        // Create an array with all the links
	        var links = layout.links(nodes);

	        var link = vis.selectAll("pathlink")
	        .data(links)
	        .enter().append("svg:path")
	        .attr("class", "link")
	        .attr("d", diagonal)

	        var node = vis.selectAll("g.node")
	        .data(nodes)
	        .enter().append("svg:g")
	        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

	        // Add the dot at every node
	        node.append("svg:circle")
	        .attr("r", 3.5);

	        // place the name atribute left or right depending if children
	        node.append("svg:text")
	        .attr("dx", function(d) { return d.children ? -8 : 8; })
	        .attr("dy", 3)
	        .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
	        .text(function(d) { return d.name; });
	    };	
	};

	var tree = new Tree();
	tree.init();
});
