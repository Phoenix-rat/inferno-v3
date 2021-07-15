const low = require('lowdb');
const Points_config = require('../MODELS/Economy/Points_config');
const Points_profile = require('../MODELS/Economy/Points_profile');

class MemberXpEvent {
    constructor(client) {
        this.client = client;
    };

    async run(member) {
        const client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const profileData = await Points_profile.findOne({ _id: member.user.id });
        if (profileData) {
            const roleData = await Points_config.findOne({ _id: profileData.role });
    
            if (profileData.msgPoints + profileData.points.map(plog => plog.point).reduce((a, b) => a + b, 0) >= roleData.requiredPoint) {
    
                const taglırol = message.guild.roles.cache.get(roles.get("starter").value());
                const hoistroller = message.guild.roles.cache
                    .filter(r => r.rawPosition >= taglırol.rawPosition)
                    .filter(r => r.hoist)
                    .filter(r => r.id !== roles.get("booster").value())
                    .sort((a, b) => a.rawPosition - b.rawPosition).array().reverse();
                const rawrol = member.roles.cache.filter(r => r.hoist).sort((a, b) => a.rawPosition - b.rawPosition).array().reverse()[0];
                let currol = hoistroller.reverse().find(r => r.rawPosition > rawrol.rawPosition);
                let oldrol = hoistroller.reverse().find(r => r.rawPosition === rawrol.rawPosition);
                if (currol.rawPosition >= message.guild.roles.cache.get(roles.get("finisher").value()).rawPosition) return;
                if (currol) await member.roles.add(currol.id);
                if (oldrol) await member.roles.remove(oldrol.id);
                await Points_profile.updateOne({ _id: member.user.id }, {
                    $set: {
                        created: new Date(),
                        role: currol.id,
                        points: [],
                        msgPoints: 0,
                        excused: false
                    }
                });
            }

        }
    }
}
module.exports = MemberXpEvent;
