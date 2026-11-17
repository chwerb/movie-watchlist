#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, q;
    scanf("%d %d", &n, &q);

    static char s[200005];
    scanf("%s", s);

    vector<int> P(n + 1, 0);
    for (int i = 1; i <= n; i++)
        P[i] = P[i - 1] ^ (s[i - 1] == '1');

    // cum[k] = P[0] + P[1] + ... + P[k-1]
    vector<long long> cum(n + 2, 0);
    for (int i = 0; i <= n; i++)
        cum[i + 1] = cum[i] + P[i];

    while (q--) {
        int l, r;
        scanf("%d %d", &l, &r);

        long long total = r - l + 2;           
        long long c1 = cum[r + 1] - cum[l - 1]; 
        long long c0 = total - c1;           

        long long ans = c0 * (c0 - 1) / 2 + c1 * (c1 - 1) / 2;
        printf("%lld\n", ans);
    }
    return 0;
}