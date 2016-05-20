import java.util.*;
import java.io.*;
import java.math.*;

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
class Player {

    // globals && coords
    private static int W;
    private static int H;
    private static int N;

    private static int MAX_X;
    private static int MAX_Y;

    private static int X;
    private static int Y;

    // limits
    private static int UL;
    private static int DL;
    private static int LL;
    private static int RL;

    private static int STEP=2;

    static void moveUp() {
        DL = Y - 1;
        int nextY = Y - (Y-UL)/STEP - 1;
        if (nextY < 0) nextY = 1;
        if (nextY == Y) Y--;
        else Y = nextY;
    }
    static void moveDown() {
        UL = Y + 1;
        int nextY = Y + (DL-Y)/STEP + 1;
        if (nextY > MAX_Y) nextY = MAX_Y;
        if (nextY == Y) Y++;
        else Y = nextY;
    }
    static void moveLeft() {
        RL = X - 1;
        int nextX = X - (X-LL)/STEP - 1;
        if (nextX < 0) nextX = 1;
        if (nextX == X) X--;
        else X = nextX;
    }
    static void moveRight() {
        LL = X + 1;
        int nextX = X + (RL-X)/STEP + 1;
        if (nextX > MAX_X) nextX = MAX_X;
        if (nextX == X) X++;
        else X = nextX;
    }

    public static void main(String args[]) {

        Scanner in = new Scanner(System.in);

        W = in.nextInt();
        H = in.nextInt();
        N = in.nextInt();

        MAX_X = W - 1;
        MAX_Y = H - 1;

        UL = 0;
        DL = H;
        LL = 0;
        RL = W;

        X = in.nextInt();
        Y = in.nextInt();

        while (true) {

            String d = in.next();
            //System.err.println("d="+d);

            switch (d) {
                case "U":
                    moveUp();
                break;
                case "UL":
                    moveUp();
                    moveLeft();
                break;
                case "UR":
                    moveUp();
                    moveRight();
                break;
                case "D":
                    moveDown();
                break;
                case "DL":
                    moveDown();
                    moveLeft();
                break;
                case "DR":
                    moveDown();
                    moveRight();
                break;
                case "L":
                    moveLeft();
                break;
                case "R":
                    moveRight();
                break;
            }

            System.out.println(X+" "+Y);
        }
    }
}
