```mermaid
graph LR

A[Affiliate] -->|navigate| B(Shopeepay Unified Activation Page)
B-->C{check user status from BE}
C-->|Locked|D(Locked Page)
C-->|Inactive|F(Shopeepay Setup Page)
C-->|Banned|E(Banned Page)
D-->|pop result|G[Affiliate Page]
E-->|pop result|G[Affiliate Page]
F-->|pop result|G[Affiliate Page]
```