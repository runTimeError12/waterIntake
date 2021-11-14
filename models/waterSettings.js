"use strict";

module.exports = (sequelize, DataTypes) => {
    const WATER_SETTINGS = sequelize.define("waterSettings", {
        waterSettingsID: {
            field: "waterSettingsID",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        isDefault: {
            field: "isDefault",
            type: DataTypes.BOOLEAN
        },
        dailyGoals: {
            field: "dailyGoals",
            type: DataTypes.INTEGER
        },
        cupSize: {
            field: "cupSize",
            type: DataTypes.INTEGER
        },
        waterReminder: {
            field: "waterReminder",
            type: DataTypes.BOOLEAN
        },
        timeInterval: {
            field: "timeInterval",
            type: DataTypes.DECIMAL(10,2)
        },
        start: {
            field: "start",
            type: DataTypes.STRING
        },
        end: {
            field: "end",
            type: DataTypes.STRING
        },
        isActive: {
            field: "isActive",
            type: DataTypes.BOOLEAN,
            default: 1
        },        
    },
    {
        tableName: "waterSettings"
    });
    WATER_SETTINGS.associate = (models) => {
        WATER_SETTINGS.belongsTo(models.users, {
            foreignKey: "userID"
         });
        WATER_SETTINGS.belongsTo(models.users, {
          foreignKey: "createdByUserID"
        });

        WATER_SETTINGS.belongsTo(models.users, {
          foreignKey: "lastUpdatedUserID"
        });
    };
    return WATER_SETTINGS;
}