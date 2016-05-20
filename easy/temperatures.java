import java.util.*;
import java.io.*;
import java.math.*;

class Solution {

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        int N = in.nextInt(); // the number of temperatures to analyse
        in.nextLine();
        String TEMPS = in.nextLine(); // the N temperatures expressed as integers ranging from -273 to 5526

        if (N == 0) {
            System.out.println("0");
            return;
        }

        String[] splitTemps = TEMPS.split(" ");
        Set<Integer> negatives = new HashSet<>();
        Set<Integer> positives = new HashSet<>();
        for (String t : splitTemps) {
            try {
            int cur = Integer.parseInt(t);
            if (cur == 0) {
                System.out.println(cur);
                break;
            }
            if (cur < 0) {
                negatives.add(cur);
            } else {
                positives.add(cur);
            }
            } catch(Exception e) {
                continue;
            }
        }

        if (negatives.size() == 0 && positives.size() == 0) {
            System.out.println("0");
        }else if (negatives.size() == 0 && positives.size()>0){
            System.out.println(Collections.min(positives));
        } else if (negatives.size() > 0 && positives.size()==0) {
            System.out.println(Collections.max(negatives));
        } else {
            int maxNegative = Collections.max(negatives);
            int minPositive = Collections.min(positives);

            if (-maxNegative < maxNegative) {
                System.out.println(maxNegative);
            } else {
                System.out.println(minPositive);
            }
        }
    }
}
