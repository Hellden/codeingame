import java.util.*;
import java.io.*;
import java.math.*;

class Node {
    private int id;
    private Set<Node> links;
    private int pound;
    public Node(int id) {
        this.id = id;
        this.links = new HashSet<>();
        this.pound = 1;
    }
    public int id() { return this.id; }
    public Set<Node> links() { return this.links; }
    public int nbLinks() { return this.links.size(); }
    public int pound() { return this.pound; }
    public void addPound(int p) { this.pound += p; }
    public boolean equals(Object o) {
        if (!(o instanceof Node)) {
            return false;
        }
        Node n = (Node) o;
        return this.id() == n.id();
    }
    public boolean isLinkedTo(Node n) {
        return this.links.contains(n);
    }
    public void mergeTo(Node n) {
        n.addPound(this.pound);
        n.unlinkedTo(this);
    }
    public void unlinkedTo(Node n) {
        if (this.equals(n)) { return; }
        this.links.remove(n);
        //if (n.isLinkedTo(this)) { n.unlinkedTo(this); }
    }
    public void linkedTo(Node n) {
        if (this.equals(n)) { return; } // cyclic hell
        this.links.add(n);
        if (!n.isLinkedTo(this)) { n.linkedTo(this); } // bi directional
    }
    public Node firstLink() { // for UR node (a unique relation)
        if (this.links.size() == 0) { return null; }
        return this.links.iterator().next();
    }
    public String toString() {
        String str = "Node[id="+this.id;
        str += "\npound="+this.pound;
        str += "\nnbLinks="+this.nbLinks()+"\n";
        for(Node n : this.links) {
            str += "\t\t--> "+n.id+"\n"; // just id to avoid cyclic hell
        }
        return str+"\t]";
    }
}

class Relation {
    public int id1;
    public int id2;
    public Relation(int id1, int id2) {
        this.id1 = id1;
        this.id2 = id2;
    }
}

class PropagationAccumulator {
    private Set<Integer> activated;
    private int propagations;
    public PropagationAccumulator() {
        this.activated = new HashSet<>();
        this.propagations = -1;
    }
    public void accumulate(Node n, int curLvl) {
        if (activated.contains(n.id())) { return; }
        System.err.println("Acc "+n.id());
        activated.add(n.id());
        if (this.propagations < curLvl) { this.propagations = curLvl; }
        Set<Node> links = n.links();
        int nbLinks = links.size();
        if (nbLinks == 0) { return; }
        for (Node child : links) {
            this.accumulate(child, curLvl + 1);
            //child.unlinkedTo(n);
        }
    }
    /*public void accumulate(Node n) {
        if (this.activated.contains(n.id())) { return; }
        System.err.println("Acc "+n.id());
        Set<Node> links = n.links();
        if (links.size() == 0) { return; }
        Set<Node> linksLeft = new HashSet<>();
        for (Node child : links) {
            if (!this.activated.contains(child.id())) {
               linksLeft.add(child);
               this.activated.add(child.id());
               System.err.println("LL "+child.id());
            }
        }
        if (linksLeft.size() == 0) { return; }
        this.propagations++;
        for (Node child : linksLeft) {
            this.accumulate(child);
        }
    }*/
    public int propagations() { return this.propagations; }
}

class Graph {
    private Map<Integer, Node> nodes;
    public Graph(Set<Integer> nodeIds) {
        this.nodes = new HashMap<>();
        for (Integer nodeId : nodeIds) {
            this.nodes.put(nodeId, new Node(nodeId));
        }
    }
    public Node getNode(int id) { return this.nodes.get(id); }
    public void addRelation(Relation r) throws IllegalStateException {
        Node n1 = nodes.get(r.id1);
        Node n2 = nodes.get(r.id2);
        if (n1 == null || n2 == null) { throw new IllegalStateException(); }
        n1.linkedTo(n2); // bi directional
    }
    public Set<Node> getURNodes() { // node with a Unique Relation
        Set<Node> urNodes = new HashSet<>();
        Iterator<Node> it = this.nodes.values().iterator();
        while (it.hasNext()) {
            Node n = it.next();
            if (n.nbLinks() == 1) {
                urNodes.add(n);
            }
        }
        return urNodes;
    }
    public boolean merge() {
        if (this.nodes.size() == 2) { return false; }
        Set<Node> urNodes = this.getURNodes();
        Iterator<Node> it = urNodes.iterator();
        Node urNode = it.next();
        while (it.hasNext()) {
            Node nextUrNode = it.next();
            if (nextUrNode.pound() < urNode.pound()) {
                urNode = nextUrNode;
            }
        }
        Node firstLink = urNode.firstLink();
        urNode.mergeTo(firstLink);
        this.nodes.remove(urNode.id());
        //System.err.println("merge "+urNode.id()+" -> "+firstLink.id());
        return true;
    }
    public Node minimalPropagationNode() {
        int mpIt = 0;
        while (this.merge()) {
            //System.err.println("mpIteration="+(++mpIt));
        }
        //System.err.println("merge done\n"+this.toString());
        // select node with max pound
        Iterator<Node> it = this.nodes.values().iterator();
        Node mpNode = it.next();
        while (it.hasNext()) {
            Node n = it.next();
            if (n.pound() > mpNode.pound()) {
                mpNode = n;
            }
        }
        return mpNode;
    }
    public String toString() {
        String str = "Graph[\n";
        Set<Integer> nodeIds = this.nodes.keySet();
        for(Integer nodeId : nodeIds){
            str += "\t"+this.nodes.get(nodeId).toString()+"\n";
        }
        return str+"]";
    }
}

class GraphBuilder {
    private GraphBuilder(){}

    private static Set<Integer> getNodeIds(Set<Relation> relations) {
        Set<Integer> ids = new HashSet<>();
        for (Relation r : relations) {
            ids.add(r.id1);
            ids.add(r.id2);
        }
        return ids;
    }

    public static Graph buildFromRelations(Set<Relation> relations) {
        Set<Integer> nodeIds = getNodeIds(relations);
        //System.err.println("nodeIds="+nodeIds.size());
        Graph g = new Graph(nodeIds);
        for (Relation r : relations) {
            g.addRelation(r);
        }
        return g;
    }
}

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
class Solution {

    static Set<Relation> getRelations(Scanner in, int nbRelations) {
        Set<Relation> relations = new HashSet<>(nbRelations);
        while (nbRelations-- > 0) {
            relations.add(new Relation(in.nextInt(), in.nextInt()));
        }
        return relations;
    }

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt(); // the number of adjacency relations
        Set<Relation> relations = getRelations(in, n);
        //System.err.println("nbRelations="+relations.size());
        Graph g = GraphBuilder.buildFromRelations(relations);
        Graph gClone = GraphBuilder.buildFromRelations(relations);
        //System.err.println(g.toString());
        Node mpNode = g.getNode(gClone.minimalPropagationNode().id());
        System.err.println("mpNode="+mpNode.toString());
        PropagationAccumulator pAcc = new PropagationAccumulator();
        pAcc.accumulate(mpNode, 0);
        System.out.println(pAcc.propagations());
    }
}
