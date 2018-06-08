import { Component, ElementRef, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import Konva from 'konva'
import { Graph } from './journey-lib/graph'

@IonicPage()
@Component({
  selector: 'page-journey-board',
  templateUrl: 'journey-board.html'
})
export class JourneyBoardPage {
  private graph: Graph

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit(): void {
    const nodes = localStorage.getItem('nodes')
    const edges = localStorage.getItem('edges')
    this.graph = new Graph()
    if (nodes) {
      const nodesArray = JSON.parse(nodes)
      nodesArray.forEach((node: any) => {
        this.graph.addNode(node.id, node.x, node.y)
      })
      if (edges) {
        const edgesArray = JSON.parse(edges)
        edgesArray.forEach((edge: any) => {
          this.graph.addEdges(edge.origin, edge.target)
        })
      }
    }
  }

  addNode(): void {
    this.graph.addNode()
  }

  save(): void {
    console.log('Nodes:   ', Graph.getDrawService().nodes)
    window.localStorage.setItem(
      'nodes',
      JSON.stringify(Graph.getDrawService().nodes)
    )
    console.log('Edges:   ', Graph.getDrawService().edges)
    window.localStorage.setItem(
      'edges',
      JSON.stringify(Graph.getDrawService().edges)
    )
  }
  clear(): void {
    window.localStorage.removeItem('nodes')
    window.localStorage.removeItem('edges')
    window.location.reload()
  }
}
