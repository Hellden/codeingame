import java.util.*;
import java.io.*;
import java.math.*;

/**
 * Don't let the machines win. You are humanity's last hope...
 **/
class Player {

    static abstract class AbsCell {
        public int x;
        public int y;
        public boolean empty;
        protected AbsCell(int x, int y, boolean empty) {
            this.x = x;
            this.y = y;
            this.empty = empty;
        }
        public String str() { return x+" "+y; }
    }
    static class EmptyCell extends AbsCell {
        public EmptyCell(int x, int y) { super(x, y, true); }
        public EmptyCell() { this(-1, -1); }
    }
    static class Cell extends AbsCell {
        public Cell(int x, int y) { super(x, y, false); }
    }

    private static Map<Integer, List<AbsCell>> hCells;

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        int width = in.nextInt(); // the number of cells on the X axis
        in.nextLine();
        int height = in.nextInt(); // the number of cells on the Y axis
        in.nextLine();

        hCells = new HashMap<>(height);
        for (int h = 0; h < height; h++) {
            String line = in.nextLine(); // width characters, each either 0 or .
            System.err.println(line);

            List<AbsCell> cells = new ArrayList<>(line.length());
            for(int w=0; w<width; w++) {
                AbsCell c;
                if ('.' == line.charAt(w)) { c = new EmptyCell(w, h); }
                else { c = new Cell(w, h); }
                cells.add(c);
            }

            hCells.put(h, cells);
        }

        for (int h = 0; h < height; h++) {
            for (int w = 0; w < width; w++) {

                System.err.println(h+" "+w);

                AbsCell c = hCells.get(h).get(w);
                if (c.empty) { continue; }

                AbsCell right = null;
                AbsCell bottom = null;

                int rw = w + 1;
                while (right == null) {
                    if (rw == width) { right = new EmptyCell(); }
                    else {
                        AbsCell rc = hCells.get(h).get(rw);
                        if (rc.empty) { rw++; continue; }
                        right = rc;
                    }
                }

                if (h == height) { bottom = new EmptyCell(); }
                else {
                    int rh = h + 1;
                    while (bottom == null) {
                        if (rh == height) {
                            bottom = new EmptyCell();
                            continue;
                        }
                        AbsCell bc = hCells.get(rh).get(w);
                        if (bc.empty) { rh++; continue; }
                        bottom = bc;
                    }
                }

                System.out.println(c.str() +" "+right.str()+" "+bottom.str());
            }
        }

        // Write an action using System.out.println()
        // To debug: System.err.println("Debug messages...");

        //System.out.println("0 0 1 0 0 1"); // Three coordinates: a node, its right neighbor, its bottom neighbor
    }
}
