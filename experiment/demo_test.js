function demo_test({timeout}) {
    let twemp = {timeout};
    let twemp2 = {...twemp};
    twemp.timeout = '456';
    console.log('condig', {timeout});
    console.log('twemp', twemp);
    console.log('twemp2', twemp2);
}

demo_test({timeout: 123123, name: '12313'});