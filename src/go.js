require('./style/index.css');
import go from 'gojs'
import $ from "jquery"
import Inspector from "./inspector.js"
import uuid from "uuid"
//import $ from "jquery-ui"
 function init() {
      if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
        var GO = go.GraphObject.make;  // for conciseness in defining templates
        GO(go.Shape, "RoundedRectangle", { fill: "lightgreen" })
        var myDiagram =
        GO(go.Diagram, "myDiagramDiv",  // Diagram refers to its DIV HTML element by id
            {
                // start everything in the middle of the viewport
                initialContentAlignment: go.Spot.Center,
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                allowDrop: true,  // must be true to accept drops from the Palette
                "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                "LinkRelinked": showLinkLabel,
                scrollsPageOnFocus: false,
                
                // "grid.visible": true,
                // "grid.gridCellSize": new go.Size(30, 20),
                // "draggingTool.isGridSnapEnabled": true,
                // "resizingTool.isGridSnapEnabled": true,
                // "rotatingTool.snapAngleMultiple": 90,
                // "rotatingTool.snapAngleEpsilon": 45,
                "undoManager.isEnabled": true  // enable undo & redo
            });
        
        
        function makePort(name, spot, output, input) {
        return GO(go.Shape, "Circle",
                {
                    fill: "transparent",
                    stroke: null,  // this is changed to "white" in the showPorts function
                    desiredSize: new go.Size(8, 8),
                    alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                    cursor: "pointer"  // show a different cursor to indicate potential link point
                });
        };
        function showLinkLabel(e) {
            var label = e.subject.findObject("LABEL");
            if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
        }
        function showPorts(node, show) {
            var diagram = node.diagram;
            if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
            node.ports.each(function(port) {
                port.stroke = (show ? "white" : null);
            });
        };
        function nodeStyle() {
            return [
                
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                {
               
                    locationSpot: go.Spot.Center,
                    //isShadowed: true,
                    //shadowColor: "#888",
                    // handle mouse enter/leave events to show/hide the ports
                    mouseEnter: function (e, obj) {
                        showPorts(obj.part, true); 
                    },
                    click: function (e, obj) {
                       
                    },
                    mouseLeave: function (e, obj) { 
                        showPorts(obj.part, false); 
                    }
                }
            ];
        };

        // myDiagram.addDiagramListener("ChangedSelection", function(diagramEvent) {
        //     var idrag = document.getElementById("infoDraggable");
        //     idrag.style.width = "";
        //     idrag.style.height = "";
        // });
       
        var lightText = 'whitesmoke';
        myDiagram.nodeTemplate =
            GO(go.Node, "Auto",//Horizontal,Spot,Vertical
                // the entire node will have a light-blue background
                
                nodeStyle(),
              { background: "#44CCFF", selectionAdorned: true,
                resizable: true,
                resizeObjectName: "SHE",
                locationObjectName: "SHE",
                // layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
                // fromSpot: go.Spot.AllSides,
                // toSpot: go.Spot.AllSides,
            },
            GO(go.Shape, "Rectangle",
            { fill: '#44CCFF',name:"SHAPE", stroke: "#756875", strokeWidth: 3 }),
                GO(go.Panel,"Vertical",
                //GO(go.Panel,"Auto",{alignment: go.Spot.TopLeft, alignmentFocus: new go.Spot(0,0,0,0),},
                    GO(go.TextBlock,
                        "Default Text",  // the initial value for TextBlock.text
                        // some room around the text, a larger font, and a white stroke:
                        {textAlign:"left",alignment: go.Spot.TopLeft, alignmentFocus: new go.Spot(0,0,0,0),background:'red',editable: true,margin: 0, stroke: "white", font: "bold 16px sans-serif" },
                        // TextBlock.text is data bound to the "name" attribute of the model data
                        new go.Binding("text", "typeName",function(val){
                            return val
                        })),
                    
                //),
                GO(go.Picture,
                
                { margin: new go.Margin(10, 20,10,20),
                    name:"SHE",
                     width: 120, height: 100, 
                    background: "red" },
             
                new go.Binding("source")),
                GO(go.Panel,"Horizontal",
                    GO(go.TextBlock,
                        "Default Text",  // the initial value for TextBlock.text
                        // some room around the text, a larger font, and a white stroke:
                        { margin: 0, textAlign:"center",stroke: "white", font: "bold 16px sans-serif",},
                        // TextBlock.text is data bound to the "name" attribute of the model data
                        new go.Binding("text", "name",function(val){
                            return val
                        })),
                    GO(go.TextBlock,
                        "Default Text",  // the initial value for TextBlock.text
                        // some room around the text, a larger font, and a white stroke:
                        { margin: new go.Margin(0, 0,0,10), stroke: "white", font: "bold 16px sans-serif" },
                        // TextBlock.text is data bound to the "name" attribute of the model data
                        new go.Binding("text", "level",function(val){
                            return val
                        }))
                )),
                
                makePort("T", go.Spot.Top, true, true),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, true, true)
                    
                
            );
            
        myDiagram.linkTemplate =
        GO(go.Link,  // the whole link panel
            {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5, toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            mouseEnter: function(e, link) {
                 link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
            mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
            },
            new go.Binding("points").makeTwoWay(),
            GO(go.Shape,  // the highlight shape, normally transparent
            { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
            GO(go.Shape,  // the link path shape
            { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
            GO(go.Shape,  // the arrowhead
            { toArrow: "standard", stroke: null, fill: "gray"}),
            GO(go.Panel, "Auto",  // the link label, normally not visible
            { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
            new go.Binding("visible", "visible").makeTwoWay(),
            GO(go.Shape, "RoundedRectangle",  // the label shape
                { fill: "#F8F8F8", stroke: null }),
            GO(go.TextBlock, "Yes",  // the label
                {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#333333",
                editable: true
                },
                new go.Binding("text").makeTwoWay())
            )
        );

        myDiagram.groupTemplate =
        GO(go.Group, "Auto",
          {
            selectionAdornmentTemplate: // adornment when a group is selected
              GO(go.Adornment, "Auto",
                GO(go.Shape, "Rectangle",
                  { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
                GO(go.Placeholder)
              ),
            toSpot: go.Spot.AllSides, // links coming into groups at any side
            toEndSegmentLength: 30, fromEndSegmentLength: 30
          },
        GO(go.Shape, "Rectangle",
              {
            
                name: "OBJSHA1PE",
                //parameter1: 14,
                fill: "rgba(255,0,0,0.10)"
              },
              ),
          GO(go.Panel, "Vertical",
          
          GO(go.TextBlock,
                {
                name: "141",
                stretch: go.GraphObject.Fill,
                alignment: go.Spot.TopLeft,
                background: "lightgreen",
                //   alignmentFocus: new go.Spot(0,0,2,2),
                stroke:"white",
                font: "Bold 18px Sans-Serif",
               
                },
                new go.Binding("text", "groupName")),
          GO(go.Panel, "Auto",
            // GO(go.Shape, "Rectangle",
            //   {
            
            //     name: "OBJSHAPE",
            //     //parameter1: 14,
            //     fill: "rgba(255,0,0,0.10)"
            //   },
            //   ),
            GO(go.Placeholder,
              { padding: 30 }),
            // GO(go.TextBlock,
            //     {
            //     name: "141",
            //     stretch: go.GraphObject.Fill,
            //     alignment: go.Spot.TopLeft,
            //     background: "lightgreen",
            //     //   alignmentFocus: new go.Spot(0,0,2,2),
            //     stroke:"white",
            //     font: "Bold 18px Sans-Serif",
               
            //     },
            //     new go.Binding("text", "groupName")),
        )
              
          ),
          
        //   {
        //     toolTip:  //  define a tooltip for each group that displays its information
        //       GO(go.Adornment, "Auto",
        //         GO(go.Shape, { fill: "#EFEFCC" }),
        //         GO(go.TextBlock, { margin: 4 },
        //           new go.Binding("text",  "" , getInfo))
        //       )
        //   }
        );
        
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
        //菜单
        // var myPalette =
        //     GO(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
        //         {
        //         scrollsPageOnFocus: false,
        //         nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
        //         groupTemplateMap: myDiagram.groupTemplateMap,
        //         model: new go.GraphLinksModel([  // specify the contents of the Palette
        //             { category: "Children", typeName:"WEB",name:"应用1",level:1 ,source:"./src/1.jpg" },
        //             { category: "Parent", isGroup: true ,groupName:"用户应用",color:"red" },
        //         ])
        //         });
        var myPalette =
        GO(go.Palette, "myPaletteDiv",);
        myPalette.nodeTemplate =
            GO(go.Node, "Spot",
            GO(go.Shape,
                { width: 50, height: 50, fill: "white" ,
           
            },
                new go.Binding("fill", "color")),
            GO(go.TextBlock,
                new go.Binding("text", "text"))
            );
        myPalette.groupTemplate =
            GO(go.Group, "Spot",
            GO(go.Shape,
                { width: 50, height: 50, fill: "white" },
                new go.Binding("fill", "color")),
            GO(go.TextBlock,
                new go.Binding("text", "text"))
            );
        myPalette.nodeKeyProperty="id";
        var uid = uuid(12)
        myPalette.model = new go.GraphLinksModel([
            {id:uuid(),text: "元素",groupId:"",color:"red" ,typeName:"WEB",name:"应用",level:1 ,source:"./src/1.jpg",},
            {id:uuid(),isGroup: true, text: "集群",color:"yellow" ,groupName:"用户应用"},
        ]);
        // myPalette.addDiagramListener("InitialLayoutCompleted", function(diagramEvent) {
        //     var pdrag = document.getElementById("paletteDraggable");
        //     var palette = diagramEvent.diagram;
        //     pdrag.style.width = palette.documentBounds.width + 28  + "px"; // account for padding/borders
        //     pdrag.style.height = palette.documentBounds.height + 38 + "px";
        // });
        var myModel = GO(go.GraphLinksModel);//创建Model对象
        // model中的数据每一个js对象都代表着一个相应的模型图中的元素
        
        var inspector = new Inspector('myInspectorDiv', myDiagram,
            {
                // uncomment this line to only inspect the named properties below instead of all properties on each object:
                // includesOwnProperties: false,
                properties: {
                    "key":{show:false},
                    
                    "id": { readOnly: true, },
                    "isGroup": { readOnly: true, show: Inspector.showIfGroup },
                    
                }
            });
            // myDiagram.addModelChangedListener(function(e) {
            //     if (e.isTransactionFinished) console.log(e);
            // });
           
           


        myModel.linkFromPortIdProperty='fromPort';
        myModel.linkToPortIdProperty='toPort';
        myModel.nodeKeyProperty="id";
        myModel.nodeGroupKeyProperty="groupId";
        myModel.nodeDataArray = [
            { id: 1,groupId:4,typeName:"WEB",name:"应用1",level:1 ,source:"./src/1.jpg","loc":"0 77",},
            { id: 2,groupId:4,typeName:"WEB",name:"应用2",level:10,source:"./src/1.jpg","loc":"175 100", },
            { id: 3,groupId:4,typeName:"WEB",name:"应用3",level:7,source:"./src/1.jpg","loc":"175 190", },
            { id: 4, isGroup: true ,groupName:"用户应用"},
            ];//其实就是个普通json对象属性随便加，内部渲染时根据json里面的值设置节点的相应属性
        myModel.linkDataArray =[
            {from:1, to:2, fromPort:"B", toPort:"T"},
            {from:2, to:3, fromPort:"B", toPort:"T"},
        ];
        
        myDiagram.model = myModel; //将模型数据绑定到模型图上
         
    }

    init();
   
  
