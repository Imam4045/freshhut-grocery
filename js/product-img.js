/**
 * product-img.js  —  Shared product image resolution
 * Exposes:  window.PROD_IMG.resolve(item, pathPrefix, w, h)
 */
(function(global) {
    'use strict';

    const UNSPLASH = 'https://images.unsplash.com/';

    /* Phrase-level matches — checked FIRST before single-token scan.
       Prevents token-length-order conflicts like "Potato Chips" picking potato. */
    const PHRASE_PHOTOS = {
        'potato chips':   'photo-1599490659213-e2b9527bd087',
        'mixed nuts':     'https://www.whiskaffair.com/wp-content/uploads/2021/03/Honey-Roasted-Mixed-Nuts-2-1.jpg',
        'orange juice':   'photo-1600271886742-f049cd451bba',
        'green tea':      'photo-1556679343-c7306c1976bc',
        'mineral water':  'photo-1548839140-29a749e1cf4d',
        'fresh milk':     'photo-1563636619-e9143da7973b',
        'whole wheat':    'photo-1509440159596-0249088772ff',
        'red apple':      'photo-1567306226416-28f0efdc88ce',
        'banana bunch':   'photo-1571771894821-ce9b6c11b08e',
        'fresh tomatoes': 'photo-1546094096-0df4bcaaa337',
        'green spinach':  'photo-1576045057995-568f588f82fb',
        'cheese slice':   'photo-1486297678162-eb2a19b0a32d',
    };

    const KEYWORD_PHOTOS = {
        // Vegetables
        tomato:'photo-1546094096-0df4bcaaa337', tomatoes:'photo-1546094096-0df4bcaaa337',
        carrot:'photo-1598170845058-32b9d6a5da37',
        potato:'photo-1518977676601-b53f82aba655',
        onion:'photo-1508747703725-719777637510',
        garlic:'photo-1615485500704-8e990f9900f7', spinach:'photo-1576045057995-568f588f82fb',
        broccoli:'photo-1459411621453-7b03977f4bfc', cabbage:'photo-1551918120-9739cb430c6d',
        lettuce:'photo-1622206151226-18ca2c9ab4a1', cucumber:'photo-1449300079323-02e209d9d3a6',
        capsicum:'photo-1563565375-f3fdfdbefa83', cauliflower:'photo-1568584711075-3d021a7c3ca3',
        eggplant:'photo-1518843875459-f738682238a6', beetroot:'photo-1593280405106-e438ebe93f5c',
        mushroom:'photo-1604503468506-a8da13d82791', corn:'photo-1551754655-cd27e38d2076',
        pea:'photo-1586201375761-83865001e31c', bean:'photo-1572635148818-ef6fd45eb394',
        ginger:'photo-1615485500704-8e990f9900f7', chili:'photo-1584568694244-14fbdf83bd30',
        pumpkin:'photo-1570586437263-ab629fccc818', radish:'photo-1540148426945-6cf22a6b2383',
        leek:'photo-1576045057995-568f588f82fb', celery:'photo-1576045057995-568f588f82fb',
        zucchini:'photo-1449300079323-02e209d9d3a6', asparagus:'photo-1459411621453-7b03977f4bfc',
        // Fruits
        apple:'photo-1567306226416-28f0efdc88ce', banana:'photo-1571771894821-ce9b6c11b08e',
        orange:'photo-1547514701-42782101795e', mango:'photo-1553279768-865429fa0078',
        lemon:'photo-1582979512210-99b6a53386f9', lime:'photo-1582979512210-99b6a53386f9',
        strawberry:'photo-1464965911861-746a04b4bca6', grape:'photo-1537640538966-79f369143f8f',
        watermelon:'photo-1568702846914-96b305d2aaeb', pineapple:'photo-1550258987-190a2d41a8ba',
        coconut:'photo-1619566636858-adf3ef46400b', papaya:'photo-1590005354167-6da97870c757',
        guava:'photo-1536567893079-f54abdc73dc2', pear:'photo-1563288521-86ee89b6e4a3',
        plum:'photo-1599924228049-faa73b2a9cb7', kiwi:'photo-1590005354167-6da97870c757',
        cherry:'photo-1528825871115-3581a5387919', lychee:'photo-1578996022701-1c63e0c15879',
        jackfruit:'photo-1504472478235-9bc48ba4d60f', avocado:'photo-1519162808019-7de1683fa2ad',
        pomegranate:'photo-1553279768-865429fa0078',
        // Dairy
        milk:'photo-1563636619-e9143da7973b',
        egg:'photo-1582722872445-44dc5f7e3c8f', eggs:'photo-1582722872445-44dc5f7e3c8f',
        yogurt:'https://armadaledairyproducts.com/wp-content/uploads/2016/03/plain-yogurt.jpg',
        butter:'photo-1589985270826-4b7bb135bc9d',
        cheese:'photo-1486297678162-eb2a19b0a32d',
        cream:'photo-1587764379873-97837921fd44',
        ghee:'photo-1589985270826-4b7bb135bc9d',
        paneer:'photo-1486297678162-eb2a19b0a32d',
        curd:'https://armadaledairyproducts.com/wp-content/uploads/2016/03/plain-yogurt.jpg',
        // Bakery
        bread:'photo-1509440159596-0249088772ff', loaf:'photo-1509440159596-0249088772ff',
        bun:'photo-1509440159596-0249088772ff', roti:'photo-1574323347407-f5e1ad6d020b',
        cake:'photo-1578985545062-69928b1d9587', cookie:'photo-1499636136210-6f4ee915583e',
        biscuit:'photo-1617093727343-374698b1b08d', croissant:'photo-1555507036-ab1f4038808a',
        muffin:'photo-1555507036-ab1f4038808a', toast:'photo-1509440159596-0249088772ff',
        paratha:'photo-1574323347407-f5e1ad6d020b', wheat:'photo-1509440159596-0249088772ff',
        // Meat & Seafood
        chicken:'photo-1598103442097-8b74394b95c3', beef:'photo-1607623814075-e51df1bdc82f',
        mutton:'photo-1607623814075-e51df1bdc82f', lamb:'photo-1607623814075-e51df1bdc82f',
        fish:'photo-1534482421-64566f976cfa', prawn:'photo-1565680018434-b513d5e5fd47',
        shrimp:'photo-1565680018434-b513d5e5fd47', tuna:'photo-1534482421-64566f976cfa',
        hilsa:'photo-1534482421-64566f976cfa', rui:'photo-1534482421-64566f976cfa',
        crab:'photo-1565680018434-b513d5e5fd47', salmon:'photo-1534482421-64566f976cfa',
        // Grains & Pulses
        rice:'photo-1536304993881-ff86d42818ef', flour:'photo-1574323347407-f5e1ad6d020b',
        lentil:'photo-1585996702770-6b2b80ba29be', dal:'photo-1585996702770-6b2b80ba29be',
        pulse:'photo-1585996702770-6b2b80ba29be', oat:'photo-1571748982800-fa51082c2224',
        pasta:'photo-1621996346565-e3dbc646d9a9', noodle:'photo-1569050467447-ce54b3bbc37d',
        // Beverages
        coffee:'photo-1509042239860-f550ce710b93', tea:'photo-1556679343-c7306c1976bc',
        juice:'photo-1600271886742-f049cd451bba',
        water:'photo-1548839140-29a749e1cf4d', mineral:'photo-1548839140-29a749e1cf4d',
        soda:'photo-1621263764928-df1444c5e859', cola:'photo-1621263764928-df1444c5e859',
        drink:'photo-1621263764928-df1444c5e859', smoothie:'photo-1600271886742-f049cd451bba',
        // Snacks & Sweets
        chips:'photo-1599490659213-e2b9527bd087',
        nuts:'photo-1559622214-f8a9850965bb', nut:'photo-1559622214-f8a9850965bb',
        almond:'photo-1559622214-f8a9850965bb', cashew:'photo-1559622214-f8a9850965bb',
        peanut:'photo-1559622214-f8a9850965bb',
        popcorn:'photo-1505253468034-514d2507d914', cracker:'photo-1617093727343-374698b1b08d',
        chocolate:'photo-1549007994-cb92caebd54b', candy:'photo-1553909489-cd47e0ef937f',
        // Condiments & Pantry
        oil:'photo-1474979266404-7eaacbcd87c5', salt:'photo-1535585209827-a15fcdbc4c2d',
        sugar:'photo-1558642452-9d2a7deb7f62', honey:'photo-1587049352846-4a222e784d38',
        sauce:'photo-1529566652340-2f46d3f9a0d5', ketchup:'photo-1529566652340-2f46d3f9a0d5',
        vinegar:'photo-1474979266404-7eaacbcd87c5', masala:'photo-1535585209827-a15fcdbc4c2d',
        curry:'photo-1604326531570-9d04f5e30543', turmeric:'photo-1615485500704-8e990f9900f7',
        cinnamon:'photo-1535585209827-a15fcdbc4c2d', jam:'photo-1493770348161-369560ae357d',
        spice:'photo-1535585209827-a15fcdbc4c2d',
        // Health & Organic
        organic:'photo-1490645935967-10de6ba17061', quinoa:'photo-1536304993881-ff86d42818ef',
        chia:'photo-1559622214-f8a9850965bb', flax:'photo-1559622214-f8a9850965bb',
        // Meats
        chicken:'photo-1604503468506-a8da13d11d36', beef:'photo-1607623814075-e51df1bdc82f',
        meat:'photo-1607623814075-e51df1bdc82f',    lamb:'photo-1607623814075-e51df1bdc82f',
    };

    const CAT_PHOTOS = {
        vegetables:'photo-1540420773420-3366772f4999', fruits:'photo-1519996529931-28324d5a630e',
        dairy:'photo-1563636619-e9143da7973b',         eggs:'photo-1582722872445-44dc5f7e3c8f',
        bakery:'photo-1509440159596-0249088772ff',      beverages:'uploads/products/Bevarage.jpeg',
        snacks:'photo-1599490659213-e2b9527bd087',      meat:'photo-1607623814075-e51df1bdc82f',
        seafood:'photo-1565680018434-b513d5e5fd47',     meats:'photo-1607623814075-e51df1bdc82f',
        grains:'photo-1536304993881-ff86d42818ef',      spices:'photo-1535585209827-a15fcdbc4c2d',
        organic:'photo-1490645935967-10de6ba17061',
    };

    const DEFAULT_IMG = UNSPLASH + 'photo-1542838132-92c53300491e?w=600&h=450&fit=crop&q=80';

    function makeUrl(photoId, w, h) {
        if (photoId.startsWith('http') || photoId.startsWith('uploads/')) return photoId;
        return UNSPLASH + photoId + '?w=' + (w||600) + '&h=' + (h||450) + '&fit=crop&q=80';
    }
    function catFallback(category, w, h) {
        if (!category) return DEFAULT_IMG;
        const k = category.toLowerCase().split(/\s+/)[0];
        return CAT_PHOTOS[k] ? makeUrl(CAT_PHOTOS[k], w, h) : DEFAULT_IMG;
    }

    function byName(name, category, w, h) {
        if (!name) return catFallback(category, w, h);
        const lc = name.toLowerCase().replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim();

        // 1. Phrase match (most specific)
        for (const [phrase, pid] of Object.entries(PHRASE_PHOTOS)) {
            if (lc.includes(phrase)) return makeUrl(pid, w, h);
        }
        // 2. Exact token match, longest first
        const tokens = lc.split(/\s+/).filter(Boolean);
        const sorted = tokens.slice().sort((a,b) => b.length - a.length);
        for (const t of sorted) {
            if (KEYWORD_PHOTOS[t]) return makeUrl(KEYWORD_PHOTOS[t], w, h);
        }
        // 3. Partial token match (min 4 chars to avoid noise)
        for (const t of sorted) {
            if (t.length < 4) continue;
            for (const [k, p] of Object.entries(KEYWORD_PHOTOS)) {
                if (t.startsWith(k) || k.startsWith(t)) return makeUrl(p, w, h);
            }
        }
        return catFallback(category, w, h);
    }

    function resolve(item, pathPrefix, w, h) {
        const img  = item.image || '';
        const name = item.name || item.product_name || '';
        const cat  = item.category || item.product_category || '';
        if (img && img !== 'default.jpg') return (pathPrefix||'uploads/products/') + img;
        return byName(name, cat, w, h);
    }

    global.PROD_IMG = { resolve, byName, catFallback, makeUrl };

})(window);
